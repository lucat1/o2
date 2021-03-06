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

// TreeRenderer returns the page and the render data for a tree view
var TreeRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	branch := muxie.GetParam(w, "branch")
	path := muxie.GetParam(w, "path")
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)

	if path == "" {
		path = "."
	}
	tree, err := repo.Branch(branch).Tree(path)
	if err != nil {
		log.Debug().
			Str("uuid", dbRepo.OwnerUUID.String()).
			Str("reponame", dbRepo.Name).
			Str("path", path).
			Err(err).
			Msg("Error while getting git tree from the filesystem repository")
		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/tree",
		Composers: []data.Composer{
			datas.RepositoryData(dbRepo),
			data.WithAny("tree", tree),
		},
	}
}

// Tree renders a folder inside a repository
func Tree(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, TreeRenderer)
}
