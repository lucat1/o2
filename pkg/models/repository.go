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

// Repository is the database model for a git repository
type Repository struct {
	Base

	OwnerName string    `json:"owner"`
	OwnerUUID uuid.UUID `json:"-"`

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
