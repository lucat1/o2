package shared

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/render"
)

// NotFoundRenderer returns the page and data to render a 404 url
var NotFoundRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	w.WriteHeader(http.StatusNotFound)
	return render.Result{
		Page: "404",
		Tags: []string{
			render.OGPTag("title", "Not found"),
			render.OGPTag("image", ""), // TODO: move the logo somewhere static
			render.OGPTag("description", "Work on code together with your team using a fast and seamless Git web interface"),
		},
		Composers: []data.Composer{data.WithAny("path", r.URL.Path)},
	}
}

// NotFound renders a 404 page
func NotFound(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, NotFoundRenderer)
}
