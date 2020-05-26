package middleware

import (
	"net/http"
	"strings"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/models"
	"github.com/rs/zerolog/log"
)

// MustPex checks if the authenticated user has access to the required permission
// on the required resource
func MustPex(scopes []string, fallback http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			resource := r.Context().Value(Resource).(string)
			log.Debug().
				Strs("scopes", scopes).
				Str("resource", resource).
				Msg("Checking the user's permission for the required scopes")

			pexes, ok := models.FetchPexes(resource, scopes)
			if !ok {
				fallback.ServeHTTP(w, r)
				return
			}

			authRequired := false
			for _, pex := range pexes {
				if pex.RequiresAuth {
					authRequired = true
					break
				}
			}

			if !authRequired {
				has := models.HasAll(pexes, scopes)
				handle(w, r, has, f, fallback)
				return
			}

			auth.Must(func(w http.ResponseWriter, r *http.Request) {
				// we have authentication inside of here
				claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
				has := models.HasPex(pexes, claims.UUID, scopes)

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
