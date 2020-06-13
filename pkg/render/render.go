package render

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
	"github.com/omohayui/crawlerdetector"
)

// Result is a struct to hold the render result for a page
type Result struct {
	Redirect  string
	Page      string
	Tags      []string
	Composers []data.Composer
}

var detector *crawlerdetector.CrawlerDetector

func init() {
	detector = crawlerdetector.New()
}

// Renderer is a function that returns a renderer "context"
type Renderer func(writer http.ResponseWriter, request *http.Request) Result

// Render renders a page with the given renderer
func Render(w http.ResponseWriter, r *http.Request, renderer Renderer) {
	res := renderer(w, r)

	if detector.IsCrawler(r.Header.Get("User-Agent")) {
		SEO(w, r, res.Tags...)
		return
	}

	composers := append([]data.Composer{data.Base}, res.Composers...)
	if len(res.Redirect) > 0 {
		quercia.Redirect(w, r, res.Redirect, res.Page, data.Compose(r, composers...))
	} else {
		quercia.Render(w, r, res.Page, data.Compose(r, composers...))
	}
}

// WithRedirect returns a copy of the given result with a redirect field
func WithRedirect(result Result, to string) Result {
	result.Redirect = to
	return result
}
