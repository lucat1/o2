package repository

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
)

func IssuesRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	return render.Result{
		Page: "repository/issues",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issues", nil),
		},
	}
}

func Issues(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, IssuesRenderer)
}
