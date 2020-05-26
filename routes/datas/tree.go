package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/quercia"
)

// TreeData composes the data for a repository tree
func TreeData(tree *git.Tree) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"tree": tree,
		}
	}
}
