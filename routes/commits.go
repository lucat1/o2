package routes

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
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
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)
	branch := muxie.GetParam(w, "branch")
	_page := muxie.GetParam(w, "page")

	page := 0
	if _page != "" {
		id, err := strconv.Atoi(_page)
		if err != nil {
			log.Debug().
				Str("username", dbRepo.OwnerName).
				Str("reponame", dbRepo.Name).
				Str("page", _page).
				Err(err).
				Msg("Invalid commits page")
			NotFound(w, r)
			return
		}
		page = id
	}

	commits, err := repo.Branch(branch).Commits(page, 20)
	if err != nil {
		log.Debug().
			Str("username", dbRepo.OwnerName).
			Str("reponame", dbRepo.Name).
			Int("page", page).
			Err(err).
			Msg("Error while getting git commits from the filesystem repository")
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
