package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func repositoryData(repo models.Repository) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"repository": repo,
		}
	}
}

// Repository renders the view of a git repository
func Repository(w http.ResponseWriter, r *http.Request) {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)

	// ignore the error. If we get and error it means the repository has not commits
	// but that's fine as the client will display the `how to push first commit` message
	tree, _ := repo.Branch("master").Tree(".")

	quercia.Render(
		w, r,
		"repository",
		data.Compose(r, data.Base, repositoryData(dbRepo), treeData(tree)),
	)
}
