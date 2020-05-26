package repository

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

// Tree renders a folder inside a repository
func Tree(w http.ResponseWriter, r *http.Request) {
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
			Str("username", dbRepo.OwnerName).
			Str("reponame", dbRepo.Name).
			Str("path", path).
			Err(err).
			Msg("Error while getting git tree from the filesystem repository")
		shared.NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"repository/tree",
		data.Compose(r, data.Base, datas.RepositoryData(dbRepo), datas.TreeData(tree)),
	)
}
