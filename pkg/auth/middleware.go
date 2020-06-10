package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

type authType string

const (
	// ClaimsKey is the key used to obtain the user's logged in JWT claims
	ClaimsKey authType = "claims"

	// AccountKey is the key to retrieve the user's logged in struct
	AccountKey authType = "account"
)

// With checks if the user is authenticated via JWTs
func With(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, is := isAuthenticated(r)
		if !is {
			f.ServeHTTP(w, r)
			return
		}

		// fetch the currently logged in user
		user, err := models.GetUser("uuid", claims.UUID)
		if err != nil {
			log.Debug().
				Err(err).
				Str("uuid", claims.UUID.String()).
				Msg("Could not get logged in user account")

			f.ServeHTTP(w, r)
			return
		}

		f.ServeHTTP(w, r.WithContext(
			context.WithValue(
				context.WithValue(r.Context(), AccountKey, &user),
				ClaimsKey, claims,
			),
		))
	})
}

// Must forbids access to certain pages without authentication, uses the provided
// handler to display the erroring page
func Must(f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !IsAuthenticated(r) {
			// don't redirect git requests but instead ask for a BasicAuth
			if strings.Contains(r.Header.Get("User-Agent"), "git") {
				authHead := r.Header.Get("Authorization")
				if len(authHead) == 0 {
					w.Header().Add("WWW-Authenticate", "Basic realm=\".\"")
					w.WriteHeader(http.StatusUnauthorized)
					return
				}

				name, password, ok := r.BasicAuth()
				if !ok {
					w.WriteHeader(http.StatusBadRequest)
					return
				}

				token, err := Login(&models.User{
					Name:     name,
					Password: password,
				})
				if err != nil {
					w.WriteHeader(http.StatusUnauthorized)
					return
				}

				SetCookie(w, r, token)
				f.ServeHTTP(w, r)
				return
			}

			quercia.Redirect(w, r, "/login?to="+r.URL.Path, "login", quercia.Props{})
			return
		}

		f.ServeHTTP(w, r)
	}
}

// IsAuthenticated checks if the request has a reference to the user's claims
// inside the context.
func IsAuthenticated(r *http.Request) bool {
	return r.Context().Value(ClaimsKey) != nil
}
