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
			_user, _organization := GetProfile(username)

			var (
				user         models.User
				organization models.Organization
			)

			if _user == nil && _organization == nil {
				fallback(w, r)
				return
			}

			if _user != nil {
				user = *_user
			}

			if _organization != nil {
				organization = *_organization
			}

			// save the values in the context
			ctx := context.WithValue(r.Context(), User, user)
			ctx = context.WithValue(ctx, Organization, organization)

			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetProfile queries the database for a user/organization
func GetProfile(name string) (*models.User, *models.Organization) {
	var (
		user models.User
		org  models.Organization
	)

	if err := store.GetDB().
		Preload("Repositories").
		Preload("Repositories.Permissions").
		Preload("Organizations").
		Where(&models.User{Username: name}).
		First(&user).
		Error; err != nil {

		// if the name is not a user check if it's an organization
		if err := store.GetDB().
			Preload("Repositories").
			Preload("Repositories.Permissions").
			Preload("Users").
			Where(&models.Organization{Name: name}).
			First(&org).
			Error; err != nil {

			log.Debug().
				Str("name", name).
				Err(err).
				Msg("Error while querying the DB to find a user/organization")
			return nil, nil
		}

		return nil, &org
	}

	return &user, nil
}
