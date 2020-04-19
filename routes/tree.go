package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/quercia"
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
	quercia.Render(w, r, "index", data.Compose(r, data.Base))
}
