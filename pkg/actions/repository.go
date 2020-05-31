package actions

import (
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

// GetRepo returns both the database repository and the git repo on the filesystem
func GetRepo(owner uuid.UUID, name string) (*models.Repository, *git.Repository) {
	var db models.Repository

	if err := store.GetDB().
		Preload("Permissions").
		Where(&models.Repository{OwnerUUID: owner, Name: name}).
		First(&db).
		Error; err != nil {

		log.Debug().
			Str("uuid", owner.String()).
			Str("reponame", name).
			Err(err).
			Msg("Error while querying the DB to render the repository page")
		return nil, nil
	}

	git, err := git.Get(db.UUID.String())
	if err != nil {
		log.Debug().
			Str("uuid", db.UUID.String()).
			Str("reponame", name).
			Err(err).
			Msg("Error while looking for repository on the filesystem")
		return nil, nil
	}

	return &db, git
}
