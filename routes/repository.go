package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func repositoryData(repo models.Repository) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"repository": repo,
		}
	}
}

// Repository renders the view of a git repository
func Repository(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")

	var repo models.Repository
	if err := store.GetDB().
		Where(&models.Repository{OwnerName: username, Name: reponame}).
		First(&repo).
		Error; err != nil {

		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Error while query the DB to render the repository page")
		NotFound(w, r)
		return
	}

	quercia.Render(w, r, "repository", data.Compose(r, data.Base, repositoryData(repo)))
}
