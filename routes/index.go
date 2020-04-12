package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// Index provides informations about the service
// and links to the main urls
func Index(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "index", data.Compose(r, data.Base))
}
