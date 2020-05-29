package settings

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func privacyData(user models.User) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"profile": quercia.Props{
				"username": user.Username,
			},
		}
	}
}

// Privacy is a settings tab used to change privacy-concerned settings
// like passwords, emails and such
func Privacy(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	var user models.User
	if err := store.GetDB().
		Where(&models.User{Username: claims.Username}).
		First(&user).
		Error; err != nil {
		log.Debug().
			Err(err).
			Str("username", claims.Username).
			Msg("Couldn't fetch user to render the settings/privacy page")

		quercia.Redirect(w, r, "/login?to="+r.URL.Path, "login", quercia.Props{})
		return
	}

	// render the ui if the request is not a post
	if r.Method != "POST" {
		quercia.Render(
			w, r,
			"settings/privacy",
			data.Compose(r, data.Base, privacyData(user)),
		)
		return
	}
}
