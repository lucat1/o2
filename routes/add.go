package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
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
	claims := r.Context().Value(middleware.Claims).(*auth.Claims)
	username := claims.Username

	// find the logged in user
	user, err := models.FindUser(models.User{Username: username})
	if err != nil {
		log.Error().
			Str("username", username).
			Err(err).
			Msg("Could not find logged in user user")

		addErr(w, r, "Cannot find the user you are logged into. Please logout and log back in")
		return
	}

	if models.ExistsRepository(user, reponame) {
		addErr(w, r, "You already own a repository with this name")
		return
	}

	repo := models.Repository{
		Owner: user,
		Name:  reponame,
	}

	if err := store.GetDB().Save(&repo).Error; err != nil {
		log.Error().
			Str("owner", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Could not save new repository in the database")

		addErr(w, r, "Internal error. Please try again layer")
		return
	}

	if _, err := git.Init(username, reponame); err != nil {
		log.Error().
			Str("owner", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Could not initialize a bare git repository")

		addErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+username+"/"+reponame, "repository",
		data.Compose(r, data.Base, repositoryData(repo), treeData(nil)),
	)
}
