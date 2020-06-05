package models

import (
	"fmt"

	"github.com/lucat1/o2/pkg/store"
)

const addMapping = `
INSERT INTO users_organizations (user_uuid, organization_uuid) VALUES (?, ?)
`

const delMapping = `
DELETE FROM users_organizations WHERE user_uuid=? AND organization_uuid=?
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
