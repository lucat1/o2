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

// BlobRenderer returns the page and the render data for a blob page
var BlobRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)
	branch := muxie.GetParam(w, "branch")
	path := muxie.GetParam(w, "path")

	blob := repo.Branch(branch).Blob(path)
	d, err := blob.Read()
	if err != nil {
		log.Debug().
			Str("uuid", dbRepo.OwnerUUID.String()).
			Str("reponame", dbRepo.Name).
			Str("path", path).
			Err(err).
			Msg("Error while reading git blob from the filesystem repository")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/blob",
		Composers: []data.Composer{
			datas.RepositoryData(dbRepo),
			datas.BlobData(blob, d),
		},
	}
}

// Blob renders a file inside a repository
func Blob(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, BlobRenderer)
}
