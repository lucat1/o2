package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func newRepo(w http.ResponseWriter, r *http.Request, username string) {
	reponame := r.Form.Get("name")

	if store.GetDB().
		Where(models.Repository{OwnerName: username, Name: reponame}).
		First(&models.Repository{}).
		Error == nil {
		newErr(w, r, "You already own a repository with this name")
		return
	}

	repo := models.Repository{
		OwnerName: username,
		Name:      reponame,
		Permissions: []models.Permission{{
			For:   "*",
			Scope: "repo:pull",
		}, {
			For:   username,
			Scope: "repo:push",
		}},
	}

	if err := store.GetDB().Save(&repo).Error; err != nil {
		log.Error().
			Str("owner", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Could not save new repository in the database")

		newErr(w, r, "Internal error. Please try again layer")
		return
	}

	if _, err := git.Init(username, reponame); err != nil {
		log.Error().
			Str("owner", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Could not initialize a bare git repository")

		newErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+username+"/"+reponame, "repository",
		data.Compose(r, data.Base, repositoryData(repo), treeData(nil)),
	)
}
