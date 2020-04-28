package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func commitData(commit git.DetailedCommit) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"commit": commit,
		}
	}
}

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
		NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"commit",
		data.Compose(r,
			data.Base,
			repositoryData(dbRepo),
			commitData(commit),
		),
	)
}
