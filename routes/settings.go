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

	// render the ui if the request is not a post
	if r.Method != "POST" {
		quercia.Render(
			w, r,
			"settings",
			data.Compose(r, data.Base, datas.ProfileData(user)),
		)
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	// Upadte the database informations with the changed data
	// 1. Gather data
	user.Username = r.Form.Get("username")
	user.Firstname = r.Form.Get("firstname")
	user.Lastname = r.Form.Get("lastname")
	user.Location = r.Form.Get("location")

	if err := store.GetDB().Save(user).Error; err != nil {
		log.Debug().
			Str("username", user.Username).
			Str("firstname", user.Firstname).
			Str("lastname", user.Lastname).
			Str("location", user.Location).
			Msg("Could not upate user's settings")
		datas.SettingsErr(w, r, user, "Internal error. Please try again later")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+user.Username, "user",
		data.Compose(r, data.Base, datas.ProfileData(user)),
	)
}
