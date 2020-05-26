package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// Profile renders the user profile and
func Profile(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value(middleware.User)
	o := r.Context().Value(middleware.Organization)

	// if we have a user
	if u != nil && u.(models.User).Username != "" {
		user := u.(models.User)

		// filter public repositories
		repos := []models.Repository{}
		account := ""
		if auth.IsAuthenticated(r) {
			claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
			account = claims.Username
		}
		for _, repo := range user.Repositories {
			if models.HasPex(models.ToPex(repo.Permissions), account, []string{"repo:pull"}) {
				repos = append(repos, repo)
			}
		}

		user.Repositories = repos
		quercia.Render(w, r, "user", data.Compose(r, data.Base, datas.ProfileData(user)))
		return
	}

	// if we have and organization
	if o != nil && o.(models.Organization).Name != "" {
		org := o.(models.Organization)

		// filter public repositories
		repos := []models.Repository{}
		account := ""
		if auth.IsAuthenticated(r) {
			claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
			account = claims.Username
		}
		for _, repo := range org.Repositories {
			if models.HasPex(models.ToPex(repo.Permissions), account, []string{"repo:pull"}) {
				repos = append(repos, repo)
			}
		}

		org.Repositories = repos
		quercia.Render(w, r, "organization", data.Compose(r, data.Base, datas.ProfileData(org)))
	}
}
