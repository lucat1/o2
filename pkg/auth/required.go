package auth

import "net/http"

// Required is a middleware used to block requests of unauthorized users to a page
func Required(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if _, ok := IsAuthenticated(r); !ok {
			http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
			return
		}

		next(w, r)
	}
}
