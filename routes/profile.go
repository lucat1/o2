package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func profileData(user *models.User) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"profile": *user,
		}
	}
}

// Profile renders the user profile and
func Profile(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value(middleware.User)
	o := r.Context().Value(middleware.Organization)

	// if we have a user
	if u != nil {
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
		quercia.Render(w, r, "user", data.Compose(r, data.Base, profileData(&user)))
		return
	}

	// if we have and organization
	if o != nil {
		org := u.(models.User)

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
		quercia.Render(w, r, "organization", data.Compose(r, data.Base, profileData(&org)))
	}
}
