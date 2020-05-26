package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/quercia"
)

// CommitData composes the data for the commit page
func CommitData(commit git.DetailedCommit) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"commit": commit,
		}
	}
}
