package routes

import (
	"fmt"
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/pex"
	"github.com/lucat1/o2/routes/datas"
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

// Profile renders the user profile and
func Profile(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value(middleware.User)
	o := r.Context().Value(middleware.Organization)
	// get the logged in user's ID
	account := uuid.Nil
	if auth.IsAuthenticated(r) {
		claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
		account = claims.UUID
	}

	// if we have a user
	if u != nil && u.(models.User).Name != "" {
		user := u.(models.User)
		repos, err := filterRepositories(user.UUID, account)
		if err != nil {
			shared.NotFound(w, r)
			return
		}

		fmt.Println(repos)
		quercia.Render(w, r, "user", data.Compose(r, data.Base, datas.ProfileData(user)))
		return
	}

	// if we have and organization
	if o != nil && o.(models.Organization).Name != "" {
		org := u.(models.Organization)
		repos, err := filterRepositories(org.UUID, account)
		if err != nil {
			shared.NotFound(w, r)
			return
		}

		fmt.Println(repos)
		quercia.Render(w, r, "organization", data.Compose(r, data.Base, datas.ProfileData(org)))
	}
}
