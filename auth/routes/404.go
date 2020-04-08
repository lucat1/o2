package routes

import (
	"net/http"

	"github.com/lucat1/quercia"
)

// NotFound renders a 404 page
func NotFound(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "404", quercia.Props{
		"path": r.URL.Path,
	})
}
