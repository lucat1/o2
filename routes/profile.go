package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func profileData(user *models.User) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"user": *user,
		}
	}
}

// Profile renders the user profile and
func Profile(w http.ResponseWriter, r *http.Request) {
	username := muxie.GetParam(w, "username")

	var user models.User
	if err := store.GetDB().
		Preload("Repositories").
		Preload("Repositories.Permissions").
		Where(&models.User{Username: username}).
		First(&user).
		Error; err != nil {

		log.Debug().
			Str("username", username).
			Err(err).
			Msg("Error while query the DB to render the profile page")
		NotFound(w, r)
		return
	}

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
	quercia.Render(w, r, "profile", data.Compose(r, data.Base, profileData(&user)))
}
