package models

import (
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
SELECT * FROM repositories WHERE owner_uuid=? AND deleted_at IS NULL
`

const findRepositoriesByName = `
SELECT * FROM repositories WHERE owner_name=? AND deleted_at IS NULL
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

// Add adds a permission node to the repository for the given user/scope
func (repository Repository) Add(perm Permission) error {
	// assign the permission to this repository
	perm.Resource = repository.UUID

	return perm.Insert()
}

// Del removes a permission node from the repository for the given user/scope
func (repository Repository) Del(perm Permission) error {
	// assign the permission to this repository
	perm.Resource = repository.UUID

	return perm.Delete()
}

// GetRepository returns the first repository found when querying
// the database with the given field and value pair
func GetRepository(owner uuid.UUID, name string) (repository Repository, err error) {
	err = store.GetDB().Get(
		&repository,
		findRepositories+"AND name=? LIMIT 1",
		owner, name,
	)
	return
}

// GetRepositoryByName fetches for a single repository with the given owner_name and name
func GetRepositoryByName(ownerName string, name string) (repository Repository, err error) {
	err = store.GetDB().Get(
		&repository,
		findRepositoriesByName+"AND name=? LIMIT 1",
		ownerName, name,
	)
	return
}

// GetRepositoryByUUID fetches for a single repository with the given UUID
func GetRepositoryByUUID(id uuid.UUID) (repository Repository, err error) {
	err = store.GetDB().Get(
		&repository,
		"SELECT * FROM repositories WHERE uuid=? AND deleted_at IS NULL LIMIT 1",
		id,
	)
	return
}

// SelectRepositories returns a list of repositories for a given owner
func SelectRepositories(owner uuid.UUID) (repositories []Repository, err error) {
	err = store.GetDB().Select(
		&repositories,
		findRepositories,
		owner,
	)
	return
}

// SelectRepositoriesWhere returns a list of repositories for the requested resource
// also appending the requested `extra` where parameter to the sql string
func SelectRepositoriesWhere(owner uuid.UUID, extra string, others ...interface{}) (repositories []Repository, err error) {
	err = store.GetDB().Select(
		&repositories,
		findRepositories+"AND "+extra,
		owner, others,
	)
	return
}
