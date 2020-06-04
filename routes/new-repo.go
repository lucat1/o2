package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/actions"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"

	uuid "github.com/satori/go.uuid"
)

func newRepo(w http.ResponseWriter, r *http.Request, owner string, extra *uuid.UUID) {
	reponame := r.Form.Get("name")
	userOwner, orgOwner := actions.GetProfile(owner)

	var (
		username string
		UUID     uuid.UUID
	)

	if userOwner != nil {
		username = userOwner.Name
		UUID = userOwner.UUID
	}

	if orgOwner != nil {
		username = orgOwner.Name
		UUID = orgOwner.UUID
	}

	_, err := models.GetRepository(UUID, reponame)
	if err == nil {
		datas.NewErr(w, r, "You already own a repository with this name")
		return
	}

	repo := models.Repository{
		OwnerUUID: UUID,
		OwnerName: username,
		Name:      reponame,
		// Permissions: []models.Permission{{
		// 	For:   "*",
		// 	Scope: "repo:pull",
		// }, {
		// 	For:   UUID.String(),
		// 	Scope: "repo:push",
		// }},
	}

	if err = repo.Insert(); err != nil {
		goto fatal
	}

	// add permissions
	if err = repo.Add(models.Permission{
		Beneficiary: uuid.Nil,
		Scope:       "repo:pull",
	}); err != nil {
		goto fatal
	}

	if err = repo.Add(models.Permission{
		Beneficiary: UUID,
		Scope:       "repo:push",
	}); err != nil {
		goto fatal
	}

	// add extra push permissions to the user
	if extra != nil {
		if err = repo.Add(models.Permission{
			Beneficiary: *extra,
			Scope:       "repo:push",
		}); err != nil {
			goto fatal
		}
	}

	if _, err := git.Init(repo.UUID.String()); err != nil {
		log.Error().
			Str("owner", UUID.String()).
			Str("reponame", reponame).
			Str("repoUUID", repo.UUID.String()).
			Err(err).
			Msg("Could not initialize a bare git repository")

		datas.NewErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+username+"/"+reponame, "repository/repository",
		data.Compose(r, data.Base, datas.RepositoryData(repo), datas.TreeData(nil)),
	)
	return

fatal:
	log.Error().
		Err(err).
		Str("owner", UUID.String()).
		Str("reponame", reponame).
		Msg("Could not save new repository in the database")

	datas.NewErr(w, r, "Internal error. Please try again layer")
	return
}
