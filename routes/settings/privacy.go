package settings

import (
	"fmt"
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

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
			data.Compose(r, data.Base, datas.ProfileData(user)),
		)
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	// Check if we are updating the user's password
	currentPassword := r.Form.Get("current")
	newPassword := r.Form.Get("new")

	var err string
	if currentPassword != "" && newPassword != "" {
		// check if the current passowrd matches
		if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)) != nil {
			err = "The current password is invalid."
			goto renderError
		}

		// update the password and save it into the database
		hashed, e := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
		if e != nil {
			log.Error().Err(e).Msg("Could not hash new password during a password change")

			err = "Internal error. Please try again later"
			goto renderError
		}

		user.Password = string(hashed)
		if e := store.GetDB().Save(&user).Error; e != nil {
			log.Error().Err(e).Bytes("hashed", hashed).Msg("Error while updating a user's password")

			err = "Internal error. Please try again later"
			goto renderError
		}

		fmt.Println(user.UUID.String())
		quercia.Redirect(
			w, r,
			"/"+claims.Username, "user",
			data.Compose(r, data.Base, datas.ProfileData(user)),
		)
		return
	}

	goto renderError

renderError:
	datas.SettingsError(
		w, r,
		"settings/privacy",
		err,
	)
}
