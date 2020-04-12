package models

import (
	"github.com/lucat1/o2/pkg/store"
)

// User is the database model for a user
type User struct {
	Base

	Email    string `gorm:"type:varchar(100);unique_index"`
	Username string `gorm:"type:varchar(32);unique_index"`
	Password string
}

// ExistsUser checks if the requested user exists
// it checks for these parameters in the object in order:
// - UUID
// - Username
// otherwhise return false
func ExistsUser(user User) bool {
	var dummy User
	if username := user.Username; username != "" {
		// we have the username, query the database to search for the user
		if store.GetDB().Where("username = ?", username).Find(&dummy, "").Error != nil {
			return false
		}

		return true
	}

	if email := user.Email; email != "" {
		// we have the email, query the database to search for the user ('cause email is unique too)
		if store.GetDB().Where("email = ?", email).Find(&dummy, "").Error != nil {
			return false
		}

		return true
	}

	if uuid := user.Base.UUID.String(); uuid != "" {
		// we have a uuid, we wanna use it as it's more "precise"
		if store.GetDB().Where("uuid = ?", uuid).Find(&dummy, "").Error != nil {
			return false
		}

		return true
	}

	return false
}
