package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

func newOrg(w http.ResponseWriter, r *http.Request, user models.User) {
	orgname := r.Form.Get("name")
	_, err := models.GetUser("name", orgname)
	if err == nil {
		datas.NewErr(w, r, "This name is already taken")
		return
	}

	org := models.User{
		Type: models.OrganizationType,
		Name: orgname,
	}

	// save the org
	if err := org.Insert(); err != nil {
		goto fatal
	}

	// assign the user to the org
	if err := org.Add(user); err != nil {
		goto fatal
	}

	quercia.Redirect(
		w, r,
		"/"+org.Name, "organization",
		data.Compose(r, data.Base, datas.ProfileData(org)),
	)
	return

fatal:
	log.Error().
		Err(err).
		Str("owner", user.Name).
		Str("orgname", orgname).
		Msg("Could not save new organization in the database")

	datas.NewErr(w, r, "Internal error. Please try again layer")
	return
}
