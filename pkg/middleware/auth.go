package middleware

import (
	"context"
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
)

type authType string

// Claims is the key used to obtain the user's logged in data
const Claims authType = "claims"

// WithAuth checks if the user is authenticated via JWTs
func WithAuth(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, is := auth.IsAuthenticated(r)
		if !is {
			f.ServeHTTP(w, r)
			return
		}

		f.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), Claims, claims)))
	})
}

// MustAuth forbids access to certain pages without authentication, uses the provided
// handler to display the erroring page
func MustAuth(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !IsAuthenticated(r) {
			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}

		f.ServeHTTP(w, r)
	}
}

// IsAuthenticated checks if the request has a reference to the user's claims
// inside the context.
func IsAuthenticated(r *http.Request) bool {
	return r.Context().Value(Claims) != nil
}
