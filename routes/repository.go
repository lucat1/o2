package routes

import (
	"net/http"
	"strings"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func repositoryData(repo models.Repository) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"repository": repo,
		}
	}
}

func readmeData(data string) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"readme": data,
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

	// find a readme and read it if available
	readme, valid := "", []string{"readme.md", "readme"}
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

	quercia.Render(
		w, r,
		"repository",
		data.Compose(
			r, data.Base,
			repositoryData(dbRepo),
			treeData(tree),
			readmeData(readmeContent),
		),
	)
}
