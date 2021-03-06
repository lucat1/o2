package models

import (
	"fmt"
	"time"

	"github.com/lucat1/o2/pkg/images"
	"github.com/lucat1/o2/pkg/store"
	"github.com/m1ome/randstr"
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

const findPicture = `
SELECT picture FROM users WHERE name=? AND deleted_at IS NULL
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

func (user *User) generate() error {
	user.Base.generate()
	hash, err := images.Encrypt(user.UUID.Bytes())
	if err != nil {
		return err
	}

	user.Picture = hash
	return nil
}

// Insert inserts a user into the database
func (user *User) Insert() error {
	// generate uuids and timestamps
	if err := user.generate(); err != nil {
		return err
	}

	if user.Type == OrganizationType {
		user.Email = randstr.GetString(100)
	}

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

	// invalidate the profile picture cache
	// as the user could have changed the image
	images.Cache.Delete(user.Picture)

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

// GetUser returns the first user found when querying the database
// with the given field and value pair
func GetPicture(name string) (picture string, err error) {
	err = store.GetDB().Get(
		&picture,
		findPicture,
		name,
	)
	return
}

// SelectUsers returns a list of users matching the given field/value pair
func SelectUsers(field string, value interface{}) (users []User, err error) {
	err = store.GetDB().Select(&users, fmt.Sprintf(findUsers, field), value)
	return
}
