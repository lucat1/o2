package routes

import (
	"net/http"
	"path"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
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

	blob := repo.Branch("master").Blob(path)
	d, err := blob.Read()
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
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
