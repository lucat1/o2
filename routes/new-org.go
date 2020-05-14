package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func newOrg(w http.ResponseWriter, r *http.Request, user models.User) {
	orgname := r.Form.Get("name")

	if err := store.GetDB().
		Where(models.User{Username: orgname}).
		First(&models.User{}).
		Error; err == nil {
		newErr(w, r, "This name is already taken by an user")
		return
	}

	if err := store.GetDB().
		Where(models.User{Type: models.TOrganization, Username: orgname}).
		Find(&models.User{}).
		Error; err == nil {
		newErr(w, r, "This name is already taken by another organization")
		return
	}

	org := models.User{
		Type:     models.TOrganization,
		Username: orgname,
		Users:    []models.User{user},
	}
	if err := store.GetDB().Save(&org).Error; err != nil {
		log.Error().
			Str("owner", user.Username).
			Str("orgname", orgname).
			Err(err).
			Msg("Could not save new organization in the database")

		newErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+org.Username, "organization",
		data.Compose(r, data.Base, profileData(org)),
	)
}
