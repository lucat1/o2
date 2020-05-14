package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
)

type profileType string

// User is the context key to get the route user instance
const User = profileType("user")

// WithProfile is a middleware used to provide the
// profile data in the request context
func WithProfile(fallback http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			username := muxie.GetParam(w, "username")
			var user models.User

			if err := store.GetDB().
				Preload("Repositories").
				Preload("Repositories.Permissions").
				Preload("Organizations").
				Preload("Users").
				Where(&models.User{Username: username}).
				First(&user).
				Error; err != nil {

				log.Debug().
					Str("username", username).
					Err(err).
					Msg("Error while query the DB to find a user")
				fallback(w, r)
				return

			}

			f.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), User, user)))
		})
	}
}
