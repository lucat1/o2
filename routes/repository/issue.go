package repository

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
)

func IssueRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	rawID := muxie.GetParam(w, "id")
	id, err := strconv.Atoi(rawID)
	issue, err := models.GetIssue(repo.UUID, id)
	if err != nil {
		log.Error().
			Err(err).
			Str("repository", repo.UUID.String()).
			Str("raw_id", rawID).
			Int("id", id).
			Msg("Could not find issue")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/issue",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issue", issue),
		},
	}
}

func Issue(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, IssueRenderer)
}
