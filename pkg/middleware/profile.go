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

const (
	// User is the context key to get the route user instance
	User = profileType("user")

	// Organization is the context key to get the route org instance
	Organization = profileType("org")
)

// WithProfile is a middleware used to provide the
// profile data in the request context
func WithProfile(fallback http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			username := muxie.GetParam(w, "username")
			var (
				user models.User
				org  models.Organization
			)

			if err := store.GetDB().
				Preload("Repositories").
				Preload("Repositories.Permissions").
				Preload("Organizations").
				Where(&models.User{Username: username}).
				First(&user).
				Error; err != nil {

				// if the username is not a user check if it's an organization
				if err := store.GetDB().
					Preload("Repositories").
					Preload("Repositories.Permissions").
					Preload("Users").
					Where(&models.Organization{Name: username}).
					First(&org).
					Error; err != nil {

					log.Debug().
						Str("username", username).
						Err(err).
						Msg("Error while querying the DB to find a user/organization")
					fallback(w, r)
					return
				}
			}

			// save the values in the context
			ctx := context.WithValue(r.Context(), User, user)
			ctx = context.WithValue(ctx, Organization, org)

			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
