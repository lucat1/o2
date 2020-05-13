package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func newData(user models.User) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"user": user,
		}
	}
}

func newErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "new", data.Compose(
		r,
		data.Base,
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}

// New prompts the user to create a new repository or an organization
func New(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)

	// get all the mandatory data
	kind := r.FormValue("kind")
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
	username := claims.Username

	// find the logged in user
	var user models.User
	if err := store.GetDB().
		Preload("Organizations").
		Where(&models.User{Username: username}).
		First(&user).Error; err != nil {
		log.Error().
			Str("username", username).
			Err(err).
			Msg("Could not find logged in user user")

		newErr(w, r, "Cannot find the user you are logged into. Please logout and log back in")
		return
	}

	if r.Method != "POST" {
		quercia.Render(w, r, "new", data.Compose(r, data.Base, newData(user)))
		return
	}

	switch kind {
	case "repository":
		newRepo(w, r, user)
		break

	case "organization":
		newOrg(w, r, user)
		break

	default:
		newErr(w, r, "Invalid new type of resource")
	}
}
