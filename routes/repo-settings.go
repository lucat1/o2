package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// Settings renders the settings of a repository
func Settings(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "settings", data.Compose(r, data.Base))
}
