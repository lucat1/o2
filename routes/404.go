package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

func notFoundData(r *http.Request) quercia.Props {
	return quercia.Props{
		"path": r.URL.Path,
	}
}

// NotFound renders a 404 page
func NotFound(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	quercia.Render(w, r, "404", data.Compose(r, data.Base, notFoundData))
}
