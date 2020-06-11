package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
)

func newOrg(w http.ResponseWriter, r *http.Request, user models.User) render.Result {
	orgname := r.Form.Get("name")
	_, err := models.GetUser("name", orgname)
	if err == nil {
		return render.Result{
			Page: "new",
			Composers: []data.Composer{
				data.WithAny("error", "This name is already taken"),
			},
		}
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

	return render.Result{
		Page:     "organization",
		Redirect: "/" + org.Name,
		Composers: []data.Composer{
			data.WithAny("profile", org),
		},
	}

fatal:
	log.Error().
		Err(err).
		Str("owner", user.Name).
		Str("orgname", orgname).
		Msg("Could not save new organization in the database")

	return render.Result{
		Page: "new",
		Composers: []data.Composer{
			data.WithAny("error", "Internal error. Please try again layer"),
		},
	}
}
