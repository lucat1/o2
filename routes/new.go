package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// New prompts the user to create a new repository or an organization
func New(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(auth.AccountKey).(*models.User)
	if user == nil {
		quercia.Redirect(w, r, "/login?to="+r.URL.Path, "login", data.Compose(r, data.Base))
		return
	}

	if r.Method != "POST" {
		orgs, _ := models.SelectMapping("user", user.UUID)

		quercia.Render(
			w, r, "new",
			data.Compose(r,
				data.Base,
				data.WithAny("user", user),
				data.WithAny("organizations", orgs),
			),
		)
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)

	// get all the mandatory data
	kind := r.FormValue("kind")
	owner := r.FormValue("owner")

	switch kind {
	case "repository":
		// if the user is creating a repository for another org
		// we give the creator push permissions
		if owner != user.Name {
			newRepo(w, r, owner, &user.UUID)
		} else {
			newRepo(w, r, owner, nil)
		}
		break

	case "organization":
		newOrg(w, r, *user)
		break

	default:
		datas.NewErr(w, r, "Invalid new type of resource")
	}
}
