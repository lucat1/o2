package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

// Settings renders the settings of a user/organization
func Settings(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	var user models.User
	if err := store.GetDB().
		Where(&models.User{Username: claims.Username}).
		First(&user).
		Error; err != nil {
		log.Debug().
			Err(err).
			Str("username", claims.Username).
			Msg("Couldn't fetch user to render the settings page")

		quercia.Redirect(w, r, "/login?to="+r.URL.Path, "login", quercia.Props{})
		return
	}

	quercia.Render(
		w, r,
		"settings",
		data.Compose(r, data.Base, datas.ProfileData(user)),
	)
}
