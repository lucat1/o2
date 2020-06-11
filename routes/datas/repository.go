package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/pex"
	"github.com/lucat1/quercia"
)

// RepositoryData composes the data for a repository view
func RepositoryData(repo models.Repository) data.Composer {
	return func(r *http.Request) quercia.Props {
		canPush := false
		if auth.IsAuthenticated(r) {
			claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
			canPush = pex.Can(repo.UUID, claims.UUID, []string{"repo:push"})
		}

		return quercia.Props{
			"repository": repo,
			"owns":       canPush,
		}
	}
}
