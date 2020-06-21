package repository

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
)

func IssueRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	return render.Result{
		Page: "repository/issue",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issue", nil),
		},
	}
}

func Issue(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, IssueRenderer)
}
