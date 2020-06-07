package routes

import (
	"net/http"
	"time"

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
	user, err := models.GetUser("name", owner)
	if err != nil {
		log.Error().
			Err(err).
			Str("owner", owner).
			Str("reponame", reponame).
			Msg("Could not find new repository owner")

		datas.NewErr(w, r, "Internal error. Please try again layer")
		return
	}

	_, err = models.GetRepository(user.UUID, reponame)
	if err == nil {
		datas.NewErr(w, r, "You already own a repository with this name")
		return
	}

	repo := models.Repository{
		OwnerUUID: user.UUID,
		OwnerName: user.Name,
		Name:      reponame,
	}
	event := models.Event{
		Time: time.Now(),
		Type: models.CreateRepositoryEvent,
	}

	if err = repo.Insert(); err != nil {
		goto fatal
	}

	// ony log the error as this is not mandatory for the creation of a repository
	event.Resource = repo.UUID
	if err = event.Insert(); err != nil {
		log.Error().
			Err(err).
			Str("resource", repo.UUID.String()).
			Msg("Could not create a new event for repository creation")
	}

	// add permissions
	if err = repo.Add(models.Permission{
		Beneficiary: uuid.Nil,
		Scope:       "repo:pull",
	}); err != nil {
		goto fatal
	}

	if err = repo.Add(models.Permission{
		Beneficiary: user.UUID,
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
			Str("owner", user.UUID.String()).
			Str("reponame", reponame).
			Str("repoUUID", repo.UUID.String()).
			Err(err).
			Msg("Could not initialize a bare git repository")

		datas.NewErr(w, r, "Internal error. Please try again layer")
		return
	}

	quercia.Redirect(
		w, r,
		"/"+user.Name+"/"+reponame, "repository/repository",
		data.Compose(r, data.Base, datas.RepositoryData(repo), datas.TreeData(nil)),
	)
	return

fatal:
	log.Error().
		Err(err).
		Str("owner", user.UUID.String()).
		Str("reponame", reponame).
		Msg("Could not save new repository in the database")

	datas.NewErr(w, r, "Internal error. Please try again layer")
	return
}
