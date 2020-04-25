package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func treeData(tree *git.Tree) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"tree": tree,
		}
	}
}

// Tree renders a folder inside a repository
func Tree(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")
	branch := muxie.GetParam(w, "branch")
	path := muxie.GetParam(w, "path")

	var dbRepo models.Repository
	if err := store.GetDB().
		Where(&models.Repository{OwnerName: username, Name: reponame}).
		First(&dbRepo).
		Error; err != nil {

		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Error while query the DB to render the tree page")
		NotFound(w, r)
		return
	}

	repo, err := git.Get(username, reponame)
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Err(err).
			Msg("Error while looking for repository on the filesystem")
		NotFound(w, r)
		return
	}

	if path == "" {
		path = "."
	}
	tree, err := repo.Branch(branch).Tree(path)
	if err != nil {
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Str("path", path).
			Err(err).
			Msg("Error while getting git tree from the filesystem repository")
		NotFound(w, r)
		return
	}

	quercia.Render(
		w, r,
		"tree",
		data.Compose(r, data.Base, repositoryData(dbRepo), treeData(tree)),
	)
}
