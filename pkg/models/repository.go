package models

import (
	"fmt"
	"time"

	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const insertRepositroy = `
INSERT INTO repositories (
	uuid,
	created_at,
	updated_at,
	deleted_at,

	owner_uuid,
	owner_name,
	name,
	description
) VALUES (
	?, ?, ?, ?,
	?, ?, ?, ?
)
`

const updateRepository = `
UPDATE repositories SET
	created_at=?,
	updated_at=?,
	deleted_at=?,

	owner_uuid=?,
	owner_name=?,
	name=?,
	description=?
WHERE uuid=?
`

const findRepositories = `
SELECT * FROM repositories WHERE %s=? AND deleted_at IS NULL
`

// Repository is the database model for a git repository
type Repository struct {
	Base

	OwnerName string    `db:"owner_name" json:"owner"`
	OwnerUUID uuid.UUID `db:"owner_uuid" json:"-"`

	Name        string `json:"name"`
	Description string `json:"description"`

	// Permissions []Permission `gorm:"foreignkey:Resource;association_foreignkey:UUID" json:"-"`
}

// Insert inserts a repository into the database
func (repository *Repository) Insert() error {
	// generate uuids and timestamps
	repository.generate()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertRepositroy),
		repository.UUID,
		repository.CreatedAt,
		repository.UpdatedAt,
		repository.DeletedAt,

		repository.OwnerUUID,
		repository.OwnerName,
		repository.Name,
		repository.Description,
	)

	return err
}

// Update updates a repository struct in the database
func (repository Repository) Update() error {
	// update updated_at time stamp
	repository.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateRepository),
		repository.CreatedAt,
		repository.UpdatedAt,
		repository.DeletedAt,

		repository.OwnerUUID,
		repository.OwnerName,
		repository.Name,
		repository.Description,

		// where
		repository.UUID,
	)

	return err
}

// GetRepository returns the first repository found when querying
// the database with the given field and value pair
func GetRepository(field string, value interface{}) (repository Repository, err error) {
	err = store.GetDB().Get(
		&repository,
		fmt.Sprintf(findRepositories+"LIMIT 1", field),
		value,
	)
	return
}

// SelectRepositories returns a list of repositories
// matching the given field/value pair
func SelectRepositories(field string, value interface{}) (repositories []Repository, err error) {
	err = store.GetDB().Select(
		&repositories,
		fmt.Sprintf(findRepositories, field),
		value,
	)
	return
}
