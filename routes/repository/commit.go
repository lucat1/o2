package repository

import (
	"net/http"

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

// CommitRenderer returns the page and the render data for the commit page
var CommitRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)
	sha := muxie.GetParam(w, "sha")

	commit, err := repo.Commit(sha)
	if err != nil {
		log.Debug().
			Str("uuid", dbRepo.OwnerUUID.String()).
			Str("reponame", dbRepo.Name).
			Str("sha", sha).
			Err(err).
			Msg("Error while looking for commit inside a git repository")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/commit",
		Composers: []data.Composer{
			datas.RepositoryData(dbRepo),
			datas.CommitData(commit),
		},
	}
}

// Commit renders the diff of a single commit
func Commit(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, CommitRenderer)
}
