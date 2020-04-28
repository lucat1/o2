package routes

import (
	"net/http"
	"path"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func blobData(blob git.Blob, data string) data.Composer {
	return func(r *http.Request) quercia.Props {
		ext := path.Ext(blob.Name)
		if len(ext) > 1 {
			ext = ext[1:] // trim trailing .
		}

		return quercia.Props{
			"blob": blob,
			"data": data,
			"ext":  ext,
		}
	}
}

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
			Str("username", dbRepo.OwnerName).
			Str("reponame", dbRepo.Name).
			Str("path", path).
			Err(err).
			Msg("Error while reading git blob from the filesystem repository")
		NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"blob",
		data.Compose(r, data.Base, repositoryData(dbRepo), blobData(blob, d)),
	)

}
