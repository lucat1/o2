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

func commitsData(commits []git.Commit) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"commits": commits,
		}
	}
}

// Commits lists the latest 20 commits of a repository
func Commits(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")
	path := muxie.GetParam(w, "path")

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

	commits, err := repo.Branch("master").Commits(0, 10)
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Str("path", path).
			Err(err).
			Msg("Error while getting git tree from the filesystem repository")
		NotFound(w, r)
		return
	}

	quercia.Render(w, r, "commits", data.Compose(r, data.Base, repositoryData(dbRepo), commitsData(commits)))
}
