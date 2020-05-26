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

// Commit renders the diff of a single commit
func Commit(w http.ResponseWriter, r *http.Request) {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)
	sha := muxie.GetParam(w, "sha")

	commit, err := repo.Commit(sha)
	if err != nil {
		log.Debug().
			Str("username", dbRepo.OwnerName).
			Str("reponame", dbRepo.Name).
			Str("sha", sha).
			Err(err).
			Msg("Error while looking for commit inside a git repository")
		shared.NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"repository/commit",
		data.Compose(r,
			data.Base,
			datas.RepositoryData(dbRepo),
			datas.CommitData(commit),
		),
	)
}
