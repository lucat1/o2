package repository

import (
	"net/http"
	"strings"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
)

// RepositoryRenderer returns the page and the render data for a repository view
var RepositoryRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
	repo := r.Context().Value(middleware.GitRepo).(*git.Repository)

	// ignore the error. If we get and error it means the repository has not commits
	// but that's fine as the client will display the `how to push first commit` message
	tree, _ := repo.Branch("master").Tree(".")

	// find a readme and read it if available
	readme, valid := "", []string{"readme.md", "readme"}
	if tree != nil {
		for _, child := range tree.Children {
			stop := false
			if stop {
				break
			}

			if blob, ok := child.(git.Blob); ok {
				for _, name := range valid {
					if strings.ToLower(blob.Name) == name {
						readme = blob.Name
						stop = true
						break
					}
				}
			}
		}
	}

	readmeContent := ""
	if readme != "" {
		blob := repo.Branch("master").Blob(readme)
		data, err := blob.Read()
		if err != nil {
			log.Debug().
				Err(err).
				Str("readme", readme).
				Msg("Error while reading README blobk")
		}
		readmeContent = data
	}

	// also provide all refs(branches/tags)
	refs, _ := repo.Refs()

	return render.Result{
		Page: "repository/repository",
		Composers: []data.Composer{
			datas.RepositoryData(dbRepo),
			data.WithAny("tree", tree),
			data.WithAny("readme", readmeContent),
			data.WithAny("refs", refs),
		},
	}
}

// Repository renders the view of a git repository
func Repository(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, RepositoryRenderer)
}
