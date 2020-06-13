package middleware

import (
	"net/http"
)

// Scheme sets r.URL.Scheme if not defined already
func Scheme(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Scheme == "" {
			r.URL.Scheme = "http"
		}

		f.ServeHTTP(w, r)
	})
}
