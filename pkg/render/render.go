package render

import (
	"net/http"

	"github.com/lucat1/quercia"
)

// Renderer is a function that returns a renderer "context"
type Renderer func(writer http.ResponseWriter, request *http.Request) (page string, data quercia.Props)

// Render renders a page with the given renderer
func Render(w http.ResponseWriter, r *http.Request, renderer Renderer) {
	page, data := renderer(w, r)
	quercia.Render(w, r, page, data)
}

// Redirect redirects a page with the given renderer
func Redirect(w http.ResponseWriter, r *http.Request, url string, renderer Renderer) {
	page, data := renderer(w, r)
	quercia.Redirect(w, r, url, page, data)
}
