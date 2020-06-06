package models

import (
	"fmt"
	"time"

	"github.com/lucat1/o2/pkg/store"
)

// Type is a custom string to hold user/organization values
type Type string

const (
	// UserType is a custom type to identify a user struct
	UserType Type = "user"

	// OrganizationType is a custom type to identify an organization struct
	OrganizationType Type = "organization"
)

const insertUser = `
INSERT INTO users (
	uuid,
	created_at,
	updated_at,
	deleted_at,

	type,
	email,
	name,
	password,

	firstname,
	lastname,
	description,
	location,
	picture
) VALUES (
	?, ?, ?, ?,
	?, ?, ?, ?,
	?, ?, ?, ?, ?
)
`

const updateUser = `
UPDATE users SET
	created_at=?,
	updated_at=?,
	deleted_at=?,

	type=?,
	email=?,
	name=?,
	password=?,

	firstname=?,
	lastname=?,
	description=?,
	location=?,
	picture=?
WHERE uuid=?
`

const findUsers = `
SELECT * FROM users WHERE %s=? AND deleted_at IS NULL
`

// User is the database model for a user
type User struct {
	Base

	Type     Type   `json:"type"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"-"`

	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Description string `json:"description"`
	Location    string `json:"location"`
	Picture     string `json:"picture"`
}

// Insert inserts a user into the database
func (user *User) Insert() error {
	// generate uuids and timestamps
	user.generate()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertUser),
		user.UUID,
		user.CreatedAt,
		user.UpdatedAt,
		user.DeletedAt,

		user.Type,
		user.Email,
		user.Name,
		user.Password,

		user.Firstname,
		user.Lastname,
		user.Description,
		user.Location,
		user.Picture,
	)

	return err
}

// Update updates a user struct in the database
func (user User) Update() error {
	// update updated_at time stamp
	user.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateUser),
		user.CreatedAt,
		user.UpdatedAt,
		user.DeletedAt,

		user.Type,
		user.Email,
		user.Name,
		user.Password,

		user.Firstname,
		user.Lastname,
		user.Description,
		user.Location,
		user.Picture,

		// where
		user.UUID,
	)

	return err
}

// GetUser returns the first user found when querying the database
// with the given field and value pair
func GetUser(field string, value interface{}) (user User, err error) {
	err = store.GetDB().Get(
		&user,
		fmt.Sprintf(findUsers+"LIMIT 1", field),
		value,
	)
	return
}

// SelectUsers returns a list of users matching the given field/value pair
func SelectUsers(field string, value interface{}) (users []User, err error) {
	err = store.GetDB().Select(&users, fmt.Sprintf(findUsers, field), value)
	return
}
