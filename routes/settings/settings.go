package settings

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// Settings renders the settings of a user/organization
func Settings(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(auth.AccountKey).(*models.User)
	if user == nil {
		quercia.Redirect(w, r, "/login?to="+r.URL.Path, "login", data.Compose(r, data.Base))
		return
	}

	// render the ui if the request is not a post
	if r.Method != "POST" {
		quercia.Render(
			w, r,
			"settings/settings",
			data.Compose(r, data.Base, data.WithAny("profile", user)),
		)
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	// Upadte the database informations with the changed data
	// 1. Gather data
	user.Name = r.Form.Get("name")
	user.Firstname = r.Form.Get("firstname")
	user.Lastname = r.Form.Get("lastname")
	user.Location = r.Form.Get("location")
	user.Description = r.Form.Get("description")

	// 2. Update the database
	if err := user.Update(); err != nil {
		log.Debug().
			Err(err).
			Str("name", user.Name).
			Str("firstname", user.Firstname).
			Str("lastname", user.Lastname).
			Str("location", user.Location).
			Str("description", user.Description).
			Msg("Could not upate user's settings")

		datas.SettingsError(
			w, r,
			"settings/settings",
			"Internal error. Please try again later",
		)
		return
	}

	log.Debug().
		Str("name", user.Name).
		Str("firstname", user.Firstname).
		Str("lastname", user.Lastname).
		Str("location", user.Location).
		Str("description", user.Description).
		Msg("Updated user settings")

	// update auth token
	token, _ := auth.Token(*user)
	auth.SetCookie(w, r, token)

	// Hard redirect to refresh the data
	http.Redirect(w, r, "/"+user.Name, http.StatusTemporaryRedirect)
}
