package settings

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes"
	"golang.org/x/crypto/bcrypt"
)

// PrivacyRenderer returns the page and the render data for the privacy settings view
var PrivacyRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	user := r.Context().Value(auth.AccountKey).(*models.User)
	if user == nil {
		return render.WithRedirect(routes.LoginRenderer(w, r), "/login?to="+r.URL.Path)
	}

	// render the ui if the request is not a post
	if r.Method != "POST" {
		return render.Result{
			Page: "settings/privacy",
			Composers: []data.Composer{
				data.WithAny("profile", user),
			},
		}
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
		if e := user.Update(); e != nil {
			log.Error().Err(e).Bytes("hashed", hashed).Msg("Error while updating a user's password")

			err = "Internal error. Please try again later"
			goto renderError
		}

		// Hard redirect to refresh the data
		return render.Result{
			Redirect: "/" + user.Name,
		}
	}

	goto renderError

renderError:
	return render.Result{
		Page: "settings/privacy",
		Composers: []data.Composer{
			data.WithAny("error", err),
		},
	}
}

// Privacy is a settings tab used to change privacy-concerned settings
// like passwords, emails and such
func Privacy(w http.ResponseWriter, r *http.Request) {
}
