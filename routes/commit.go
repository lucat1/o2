package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func commitData(commit git.DetailedCommit) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"commit": commit,
		}
	}
}

// Commit renders the diff of a single commit
func Commit(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")
	sha := muxie.GetParam(w, "sha")

	var dbRepo models.Repository
	if err := store.GetDB().
		Where(&models.Repository{OwnerName: username, Name: reponame}).
		First(&dbRepo).
		Error; err != nil {

		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Error while query the DB to render the tree page")
		NotFound(w, r)
		return
	}

	repo, err := git.Get(username, reponame)
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Error while looking for repository on the filesystem")
		NotFound(w, r)
		return
	}

	commit, err := repo.Commit(sha)
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Str("sha", sha).
			Err(err).
			Msg("Error while looking for commit inside a git repository")
		NotFound(w, r)
		return
	}

	quercia.Render(w, r, "commit", data.Compose(r, data.Base, repositoryData(dbRepo), commitData(commit)))
}
