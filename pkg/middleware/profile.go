package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/actions"
	"github.com/lucat1/o2/pkg/models"
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
			_user, _organization := actions.GetProfile(username)

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
