package routes

import (
	"net/http"

	"github.com/lucat1/quercia"
)

// Index provides informations about the service
// and links to the main urls
func Index(w http.ResponseWriter, r *http.Request) {
	quercia.Render(w, r, "index", quercia.Props{
		"loggedUser": quercia.Props{
			"username": "luca",
			"email":    "fromzeroluke1@gmail.com",
		},
	})
}
