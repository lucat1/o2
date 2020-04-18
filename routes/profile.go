package routes

import (
	"net/http"

	"github.com/kataras/muxie"
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
		First(&user).
		Where("username = ?", username).
		Error; err != nil {

		log.Debug().
			Str("username", username).
			Err(err).
			Msg("Error while query the DB to render the profile page")
		NotFound(w, r)
		return
	}

	quercia.Render(w, r, "profile", data.Compose(r, data.Base, profileData(&user)))
}
