package routes

import (
	"fmt"
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func profileData(user interface{}) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"profile": user,
		}
	}
}

// Profile renders the user profile and
func Profile(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(middleware.User).(models.User)

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

	fmt.Println(user.Organizations)

	page := "user"
	if user.Type == models.TOrganization {
		page = "organization"
	}

	quercia.Render(w, r, page, data.Compose(r, data.Base, profileData(user)))
	return

}
