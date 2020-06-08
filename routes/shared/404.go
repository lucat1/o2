package shared

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/quercia"
)

// NotFoundRenderer returns the page and data to render a 404 url
var NotFoundRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) (string, quercia.Props) {
	w.WriteHeader(http.StatusNotFound)
	return "404", data.Compose(r, data.Base, data.WithAny("path", r.URL.Path))
}

// NotFound renders a 404 page
func NotFound(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, NotFoundRenderer)
}
