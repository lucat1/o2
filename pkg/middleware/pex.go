package middleware

import (
	"net/http"

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

			auth.Must(func(w http.ResponseWriter, r *http.Request) {
				// we have authentication inside of here
				claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
				has := models.HasPex(claims.Username, resource, scopes)

				if has {
					f.ServeHTTP(w, r)
				} else {
					fallback(w, r)
				}
			})(w, r)
		})
	}
}
