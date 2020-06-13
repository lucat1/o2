package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
)

// NewRenderer returns the page and the render data for both the new pages available interactions
func NewRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	user := r.Context().Value(auth.AccountKey).(*models.User)
	if user == nil {
		return render.WithRedirect(LoginRenderer(w, r), "/login?to="+r.URL.Path)
	}

	if r.Method != "POST" {
		orgs, err := models.SelectMapping("user", user.UUID)
		if err != nil {
			log.Debug().
				Err(err).
				Str("user", user.UUID.String()).
				Msg("Could not find user's oganizations")
		}

		return render.Result{
			Page: "new",
			Tags: []string{
				render.OGPTag("title", "New"),
				render.OGPTag("description", "Create a new repository or organization on the o2 platform"),
			},
			Composers: []data.Composer{data.WithAny("user", user),
				data.WithAny("organizations", orgs),
			},
		}
	}

	// get all the mandatory data
	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	kind := r.FormValue("kind")
	owner := r.FormValue("owner")

	var result render.Result
	switch kind {
	case "repository":
		// if the user is creating a repository for another org
		// we give the creator push permissions
		if owner != user.Name {
			result = newRepo(w, r, owner, &user.UUID)
		} else {
			result = newRepo(w, r, owner, nil)
		}
		break

	case "organization":
		result = newOrg(w, r, *user)
		break

	default:
		result = render.Result{
			Page:      "new",
			Composers: []data.Composer{data.WithAny("error", "Invalid new type of resource")},
		}
	}

	return result
}

// New prompts the user to create a new repository or an organization
func New(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, NewRenderer)
}
