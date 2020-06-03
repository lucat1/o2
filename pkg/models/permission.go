package models

import (
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const insertPermission = `
INSERT INTO permissions (
	beneficiary,
	resource,
	scope
) VALUES (
	?, ?, ?
)
`

const delPermission = `
DELETE FROM permissions WHERE 
	beneficiary=? AND resource=? AND scope=?
`

const findSinglePermission = `
SELECT * FROM permissions WHERE beneficiary=? AND resource=? AND scope=?
`

const findResourcePermissions = `
SELECT * FROM permissions WHERE resource=?
`

// Permission is the database model for a permission to acess a resource
type Permission struct {
	Beneficiary uuid.UUID `json:"for"`
	Resource    uuid.UUID `json:"resource"`
	Scope       string    `json:"scope"`
}

// Insert inserts a permission into the database
func (permission Permission) Insert() error {
	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertPermission),
		permission.Beneficiary,
		permission.Resource,
		permission.Scope,
	)

	return err
}

// Delete deletes this permission node in the database
func (permission Permission) Delete() error {
	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(delPermission),
		permission.Beneficiary,
		permission.Resource,
		permission.Scope,
	)

	return err
}

// GetPermission returns the permission for the
// requested beneficiary & resource & scope
func GetPermission(beneficiary uuid.UUID, resource uuid.UUID, scope string) (permission Permission, err error) {
	err = store.GetDB().Get(
		&permission,
		findSinglePermission+"LIMIT 1",
		beneficiary, resource, scope,
	)
	return
}

// SelectPermissions returns a list of permissions for the requested resource
func SelectPermissions(resource uuid.UUID) (permissions []Permission, err error) {
	err = store.GetDB().Select(
		&permissions,
		findResourcePermissions,
		resource,
	)
	return
}

// SelectPermissionsWhere returns a list of permissions for the requested resource
// also appending the requested `extra` where parameter to the sql string
func SelectPermissionsWhere(resource uuid.UUID, extra string, others ...[]interface{}) (permissions []Permission, err error) {
	err = store.GetDB().Select(
		&permissions,
		findResourcePermissions+"AND "+extra,
		resource, others,
	)
	return
}
