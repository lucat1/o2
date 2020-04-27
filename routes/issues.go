package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// Issues renders the issues page from the database
func Issues(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "index", data.Compose(r, data.Base))
}
