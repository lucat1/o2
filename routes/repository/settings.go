package repository

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// Settings renders the settings of a repository
func Settings(w http.ResponseWriter, r *http.Request) {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)

	quercia.Render(
		w, r,
		"repository/settings",
		data.Compose(r, data.Base, datas.RepositoryData(dbRepo)),
	)
}
