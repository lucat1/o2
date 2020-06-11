package repository

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
)

// CommitsRenderer returns the page and the render data for the commits page
var CommitsRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)
	branch := muxie.GetParam(w, "branch")
	_page := muxie.GetParam(w, "page")

	page := 0
	if _page != "" {
		id, err := strconv.Atoi(_page)
		if err != nil {
			log.Debug().
				Str("uuid", dbRepo.OwnerUUID.String()).
				Str("reponame", dbRepo.Name).
				Str("page", _page).
				Err(err).
				Msg("Invalid commits page")

			return shared.NotFoundRenderer(w, r)
		}

		page = id
	}

	commits, err := repo.Branch(branch).Commits(page, 20)
	if err != nil {
		log.Debug().
			Str("uuid", dbRepo.OwnerUUID.String()).
			Str("reponame", dbRepo.Name).
			Int("page", page).
			Err(err).
			Msg("Error while getting git commits from the filesystem repository")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/commits",
		Composers: []data.Composer{
			datas.RepositoryData(dbRepo),
			datas.CommitsData(branch, commits),
		},
	}
}

// Commits lists the latest 20 commits of a repository
func Commits(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, CommitsRenderer)
}
