package repository

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
	"github.com/lucat1/quercia"
)

// Blob renders a file inside a repository
func Blob(w http.ResponseWriter, r *http.Request) {
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
		shared.NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"repository/blob",
		data.Compose(r, data.Base, datas.RepositoryData(dbRepo), datas.BlobData(blob, d)),
	)

}
