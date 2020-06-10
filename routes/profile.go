package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/pex"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/shared"
	uuid "github.com/satori/go.uuid"
)

// filter repositories visible to the given viewer
func filterRepositories(owner uuid.UUID, viewer uuid.UUID) (res []models.Repository, err error) {
	repositories, err := models.SelectRepositories(owner)
	if err != nil {
		log.Debug().
			Err(err).
			Str("owner", owner.String()).
			Msg("Could not fetch profile repositories")

		return res, err
	}

	for _, repo := range repositories {
		if pex.Can(
			repo.UUID,
			viewer,
			[]string{"repo:pull"},
		) {
			res = append(res, repo)
		}
	}

	return
}

// ProfileRenderer returns the page and the render data for the profile
var ProfileRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	name := muxie.GetParam(w, "name")
	user, err := models.GetUser("name", name)

	if err != nil {
		log.Debug().
			Err(err).
			Str("name", name).
			Msg("Could not find user to render profile page")

		return shared.NotFoundRenderer(w, r)
	}

	// get the logged in user's ID
	account := uuid.Nil
	if auth.IsAuthenticated(r) {
		claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
		account = claims.UUID
	}

	repos, err := filterRepositories(user.UUID, account)
	if err != nil {
		log.Debug().
			Err(err).
			Str("owner", user.UUID.String()).
			Str("viewer", account.String()).
			Msg("Could not filter user to repositories")

		return shared.NotFoundRenderer(w, r)
	}

	typ, key := "user", "organizations"
	if user.Type == models.OrganizationType {
		typ, key = "organization", "users"
	}

	value, err := models.SelectMapping(typ, user.UUID)
	if err != nil {
		log.Debug().
			Err(err).
			Str("user-type", string(user.Type)).
			Str("typ", typ).
			Str("key", key).
			Str("uuid", user.UUID.String()).
			Msg("Error while looking for user<->orgs mapping")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: string(user.Type),
		Composers: []data.Composer{
			data.WithAny("profile", user),
			data.WithAny("repositories", repos),
			// either organizations -> []orgs, or users -> []users
			data.WithAny(key, value),
		},
	}
}

// Profile renders an user/organization profile
func Profile(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, ProfileRenderer)
}
