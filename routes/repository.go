package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// Repository renders the view of a git repository
func Repository(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "repository", data.Compose(r, data.Base))
}
