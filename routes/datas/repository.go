package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

// RepositoryData composes the data for a repository view
func RepositoryData(repo models.Repository) data.Composer {
	return func(r *http.Request) quercia.Props {
		canPush := false
		if auth.IsAuthenticated(r) {
			//username := r.Context().Value(auth.ClaimsKey).(*auth.Claims).UUID
			canPush = true //models.HasPex(models.ToPex(repo.Permissions), username, []string{"repo:push"})
		}

		return quercia.Props{
			"repository": repo,
			"owns":       canPush,
		}
	}
}

// ReadmeData composes the data for the readme component(in the repo view)
func ReadmeData(data string) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"readme": data,
		}
	}
}

// RefsData composes the git refs data for the branch/tags selector(in the repo view)
func RefsData(refs []git.Ref) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"refs": refs,
		}
	}
}
