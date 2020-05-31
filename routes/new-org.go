package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
)

func newOrg(w http.ResponseWriter, r *http.Request, user models.User) {
	orgname := r.Form.Get("name")

	if err := store.GetDB().
		Where(models.User{Name: orgname}).
		First(&models.User{}).
		Error; err == nil {
		datas.NewErr(w, r, "This name is already taken by a user")
		return
	}

	if err := store.GetDB().
		Where(models.Organization{Name: orgname}).
		Find(&models.Organization{}).
		Error; err == nil {
		datas.NewErr(w, r, "This name is already taken by another organization")
		return
	}

	org := models.Organization{
		Name:  orgname,
		Users: []models.User{user},
	}

	if err := store.GetDB().Save(&org).Error; err != nil {
		log.Error().
			Str("owner", user.Name).
			Str("orgname", orgname).
			Err(err).
			Msg("Could not save new organization in the database")

		datas.NewErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+org.Name, "organization",
		data.Compose(r, data.Base, datas.ProfileData(org)),
	)
}
