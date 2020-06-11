package settings

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes"
)

// SettingsRenderer returns the page and the render data for the general settings view
var SettingsRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	user := r.Context().Value(auth.AccountKey).(*models.User)
	if user == nil {
		return render.WithRedirect(routes.LoginRenderer(w, r), "/login?to="+r.URL.Path)
	}

	// render the ui if the request is not a post
	if r.Method != "POST" {
		return render.Result{
			Page: "settings/settings",
			Composers: []data.Composer{
				data.WithAny("profile", user),
			},
		}
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	// Upadte the database informations with the changed data
	// 1. Gather data
	user.Name = r.Form.Get("name")
	user.Firstname = r.Form.Get("firstname")
	user.Lastname = r.Form.Get("lastname")
	user.Location = r.Form.Get("location")
	user.Description = r.Form.Get("description")

	if user.Name == "" {
		return render.Result{
			Page: "settings/settings",
			Composers: []data.Composer{
				data.WithAny("error", "Your username cannot be empty!"),
			},
		}
	}

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

		return render.Result{
			Page: "settings/settings",
			Composers: []data.Composer{
				data.WithAny("error", "Internal error. Please try again later"),
			},
		}
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

	// HARD redirect to the (new) profile
	return render.Result{
		Redirect: "/" + user.Name,
	}
}

// Settings renders the settings of a user/organization
func Settings(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, SettingsRenderer)
}
