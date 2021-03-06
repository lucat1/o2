package middleware

import (
	"net/http"
	"time"

	"github.com/lucat1/o2/pkg/log"
)

// Debug logs route response timings and request data in debug mode
func Debug(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		f.ServeHTTP(w, r)
		duration := time.Now().Sub(startTime)
		log.Info().
			Str("method", r.Method).
			Str("url", r.URL.Path).
			Int64("duration", duration.Milliseconds()).
			Msg("Handled request")
	})
}
