package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/quercia"
)

// CommitsData composes the data for the commits page
func CommitsData(branch string, commits git.Commits) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"branch":  branch,
			"index":   commits.Index,
			"prev":    commits.Prev,
			"next":    commits.Next,
			"commits": commits.Commits,
		}
	}
}
