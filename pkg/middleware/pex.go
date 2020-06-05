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
			user, ok := r.Context().Value(auth.AccountKey).(*models.User)
			log.Debug().
				Strs("scopes", scopes).
				Str("resource", resource.String()).
				Bool("logged", user != nil).
				Msg("Checking the user's permission for the required scopes")

			id := uuid.Nil
			if !ok {
				id = user.UUID
			}

			if pex.Can(resource, id, scopes) {
				handle(w, r, true, f, fallback)
				return
			} else if !ok {
				// if the user is logged in and he doesn't have permission render the fallback
				fallback.ServeHTTP(w, r)
				return
			}

			// if the user/id cannot do that we ask them to log in again
			auth.Must(func(w http.ResponseWriter, r *http.Request) {
				// we have authentication inside of here
				user := r.Context().Value(auth.AccountKey).(*models.User)
				has := pex.Can(resource, user.UUID, scopes)
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
