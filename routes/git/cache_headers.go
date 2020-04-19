package git

import (
	"net/http"
	"time"
)

func headerNoCache(w http.ResponseWriter) {
	w.Header().Add("Expires", "Fri, 01 Jan 1980 00:00:00 GMT")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Cache-Control", "no-cache, max-age=0, must-revalidate")
}

func headerCacheForever(w http.ResponseWriter) {
	now := time.Now()
	w.Header().Set("Date", now.String())
	w.Header().Set("Expires", now.Add(31536000).String())
	w.Header().Set("Cache-Control", "public, max-age=31536000")
}
