package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func addErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "add", data.Compose(
		r,
		data.Base,
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}

// Add prompts the user to create a new repository
func Add(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		quercia.Render(w, r, "add", data.Compose(r, data.Base))
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)

	// get all the mandatory data
	reponame := r.Form.Get("name")
	claims, _ := auth.IsAuthenticated(r)
	username := claims.Username

	if models.ExistsRepository(username, reponame) {
		addErr(w, r, "You already own a repository with this name")
		return
	}
}
