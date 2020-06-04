package middleware

import (
	"net/http"
	"strings"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/pex"
	uuid "github.com/satori/go.uuid"
)

// MustPex checks if the authenticated user has access to the required permission
// on the required resource
func MustPex(scopes []string, fallback http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			resource := r.Context().Value(Resource).(uuid.UUID)
			log.Debug().
				Strs("scopes", scopes).
				Str("resource", resource.String()).
				Msg("Checking the user's permission for the required scopes")

			pexes := pex.SelectPexes(resource, scopes)
			// if !ok {
			// 	fallback.ServeHTTP(w, r)
			// 	return
			// }

			authRequired := false
			for _, pex := range pexes {
				if pex.RequiresAuth {
					authRequired = true
					break
				}
			}

			if !authRequired {
				has := pex.HasAll(pexes, scopes)
				handle(w, r, has, f, fallback)
				return
			}

			auth.Must(func(w http.ResponseWriter, r *http.Request) {
				// we have authentication inside of here
				claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
				user, err := models.GetUser("name", claims.Username)
				if err != nil {
					log.Debug().
						Err(err).
						Str("username", claims.Username).
						Msg("Could not fetch user from the db while checking permissions")

					fallback.ServeHTTP(w, r)
					return
				}

				has := pex.HasPex(pexes, user.UUID, scopes)

				handle(w, r, has, f, fallback)
			})(w, r)
		})
	}
}

func handle(w http.ResponseWriter, r *http.Request, has bool, f http.Handler, fallback http.HandlerFunc) {
	if has {
		f.ServeHTTP(w, r)
	} else if strings.Contains(r.Header.Get("User-Agent"), "git") {
		// send a forbidden status to git clients
		w.WriteHeader(http.StatusForbidden)
	} else {
		fallback(w, r)
	}
}
