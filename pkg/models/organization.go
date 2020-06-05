package models

import (
	"fmt"

	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const addMapping = `
INSERT INTO users_organizations (user_uuid, organization_uuid) VALUES (?, ?)
`

const delMapping = `
DELETE FROM users_organizations WHERE user_uuid=? AND organization_uuid=?
`

const findUsersOrOrganizations = `
SELECT * FROM users_organizations o JOIN users u ON o.%s_uuid = u.uuid WHERE o.%s_uuid = ?
`

// Add adds a user to the user<->organization mapping
func (org User) Add(user User) error {
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(addMapping),
		user.UUID, org.UUID,
	)
	fmt.Print("error heah", err)
	return err
}

// Del removes a user from the user<->organization mapping
func (org User) Del(user User) error {
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(delMapping),
		user.UUID, org.UUID,
	)
	return err
}

// SelectMapping selects all users belonging to an organization and vice versa
// behaviour:
// key=user --> find all organizations
// key=organization --> find all users
func SelectMapping(key string, value uuid.UUID) (orgs []User, err error) {
	other := "user"
	if key == "user" {
		other = "organization"
	}

	// we need to use unsafe as some fields returned from
	// the JOIN are not used, and that's by design
	err = store.GetDB().Unsafe().Select(
		&orgs,
		fmt.Sprintf(findUsersOrOrganizations, other, key),
		value,
	)
	return
}
