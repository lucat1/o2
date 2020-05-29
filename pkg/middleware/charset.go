package middleware

import "net/http"

// Charser sets the content encoing for each page to utf-8
func Charser(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "charset=utf-8")
		f.ServeHTTP(w, r)
	})
}
