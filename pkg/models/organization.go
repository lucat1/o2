package models

import (
	"fmt"
	"time"

	"github.com/lucat1/o2/pkg/store"
)

const insertOrganization = `
INSERT INTO organizations (
	uuid,
	created_at,
	updated_at,
	deleted_at,

	name,
	description,
	location,
	picture
) VALUES (
	?, ?, ?, ?,
	?, ?, ?, ?
)
`

const updateOrganization = `
UPDATE organizations SET
	created_at=?,
	updated_at=?,
	deleted_at=?,

	name=?,
	description=?,
	location=?,
	picture=?
WHERE uuid=?
`

const addMapping = `
INSERT INTO users_organizations (user_uuid, organization_uuid) VALUES (?, ?)
`

const delMapping = `
DELETE FROM users_organizations WHERE user_uuid=? AND organization_uuid=?
`

const findOrganizations = `
SELECT * FROM organizations WHERE %s=? AND deleted_at IS NULL
`

// Organization is the database model for an org
type Organization struct {
	Base

	Name        string `json:"name"`
	Description string `json:"description"`
	Location    string `json:"location"`
	Picture     string `json:"picture"`

	// Users        []User       `gorm:"many2many:user_orgs;" json:"users"`
	// Repositories []Repository `gorm:"polymorphic:Owner" json:"repositories"`
}

// Insert inserts an organization into the database
func (organization *Organization) Insert() error {
	// generate uuids and timestamps
	organization.generate()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertOrganization),
		organization.UUID,
		organization.CreatedAt,
		organization.UpdatedAt,
		organization.DeletedAt,

		organization.Name,
		organization.Description,
		organization.Location,
		organization.Picture,
	)

	return err
}

// Update updates an organization struct in the database
func (organization Organization) Update() error {
	// update updated_at time stamp
	organization.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateOrganization),
		organization.CreatedAt,
		organization.UpdatedAt,
		organization.DeletedAt,

		organization.Name,
		organization.Description,
		organization.Location,
		organization.Picture,

		// where
		organization.UUID,
	)

	return err
}

// Add adds a user to the user<->organization mapping
func (organization Organization) Add(user User) error {
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(addMapping),
		user.UUID, organization.UUID,
	)
	return err
}

// Del removes a user from the user<->organization mapping
func (organization Organization) Del(user User) error {
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(delMapping),
		user.UUID, organization.UUID,
	)
	return err
}

// GetOrganization returns the first organization found when querying the database
// with the given field and value pair
func GetOrganization(field string, value interface{}) (organization Organization, err error) {
	err = store.GetDB().Get(
		&organization,
		fmt.Sprintf(findOrganizations+"LIMIT 1", field),
		value,
	)
	return
}

// SelectOrganizations returns a list of organizations
// matching the given field/value pair
func SelectOrganizations(field string, value interface{}) (organizations []Organization, err error) {
	err = store.GetDB().Select(
		&organizations,
		fmt.Sprintf(findOrganizations, field),
		value,
	)
	return
}
