package actions

import (
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	uuid "github.com/satori/go.uuid"
)

// GetRepo returns both the database repository and the git repo on the filesystem
func GetRepo(owner uuid.UUID, name string) (*models.Repository, *git.Repository) {
	db, err := models.GetRepository(owner, name)
	if err != nil {
		log.Debug().
			Str("uuid", owner.String()).
			Str("reponame", name).
			Err(err).
			Msg("Error while querying the DB to render the repository page")
		return nil, nil
	}

	git, err := git.Get(owner.String())
	if err != nil {
		log.Debug().
			Str("uuid", owner.String()).
			Str("reponame", name).
			Err(err).
			Msg("Error while looking for repository on the filesystem")
		return nil, nil
	}

	return &db, git
}
