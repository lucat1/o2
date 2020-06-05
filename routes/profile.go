package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/pex"
	"github.com/lucat1/o2/routes/shared"
	"github.com/lucat1/quercia"
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

// Profile renders an user/organization profile
func Profile(w http.ResponseWriter, r *http.Request) {
	name := muxie.GetParam(w, "name")
	user, err := models.GetUser("name", name)
	if err != nil {
		log.Debug().
			Err(err).
			Str("name", name).
			Msg("Could not find user to render profile page")

		shared.NotFound(w, r)
		return
	}

	// get the logged in user's ID
	account := uuid.Nil
	if auth.IsAuthenticated(r) {
		claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
		account = claims.UUID
	}

	repos, err := filterRepositories(user.UUID, account)
	if err != nil {
		shared.NotFound(w, r)
		return
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

		shared.NotFound(w, r)
		return
	}

	// TODO: frontend -> merge user/organization pages
	quercia.Render(
		w, r, string(user.Type),
		data.Compose(r,
			data.Base,
			data.WithAny("profile", user),
			data.WithAny("repositories", repos),
			// either organizations -> []orgs, or users -> []users
			data.WithAny(key, value),
		),
	)
	return
}
