package middleware

import (
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

// DebugMiddleware logs route response timings and request data in debug mode
func DebugMiddleware(f http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now().Unix()
		f.ServeHTTP(w, r)
		endTime := time.Now().Unix()
		log.Debug().
			Str("method", r.Method).
			Str("url", r.URL.Path).
			Int64("time", endTime-startTime).
			Msg("Handled request")
	})
}
