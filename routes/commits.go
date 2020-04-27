package routes

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func commitsData(branch string, commits git.Commits) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"branch":  branch,
			"index":   commits.Index,
			"prev":    commits.Prev,
			"next":    commits.Next,
			"commits": commits.Commits,
		}
	}
}

// Commits lists the latest 20 commits of a repository
func Commits(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")
	branch := muxie.GetParam(w, "branch")
	_page := muxie.GetParam(w, "page")
	path := muxie.GetParam(w, "path")

	page := 0
	if _page != "" {
		id, err := strconv.Atoi(_page)
		if err != nil {
			log.Debug().
				Str("username", username).
				Str("reponame", reponame).
				Str("page", _page).
				Err(err).
				Msg("Invalid commits page")
			NotFound(w, r)
			return
		}
		page = id
	}

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

	commits, err := repo.Branch(branch).Commits(page, 20)
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

	quercia.Render(
		w, r,
		"commits",
		data.Compose(r,
			data.Base,
			repositoryData(dbRepo),
			commitsData(branch, commits),
		),
	)
}
