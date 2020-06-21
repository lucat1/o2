package repository

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
)

func IssuesRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	issues, err := models.SelectIssues(repo.UUID)
	if err != nil {
		log.Error().
			Err(err).
			Str("repository", repo.UUID.String()).
			Msg("Could not find repository issues")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/issues",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issues", issues),
		},
	}
}

func Issues(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, IssuesRenderer)
}
