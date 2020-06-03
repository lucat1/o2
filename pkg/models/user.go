package models

import (
	"crypto/md5"
	"fmt"
	"strings"
	"time"

	"github.com/lucat1/o2/pkg/store"
)

const insertUser = `
INSERT INTO users (
	uuid,
	created_at,
	updated_at,
	deleted_at,

	email,
	name,
	password,

	firstname,
	lastname,
	description,
	location,
	picture
) VALUES (
	?, ?, ?,
	?, ?, ?,
	?, ?, ?,
	?, ?, ?
)
`

const updateUser = `
UPDATE users SET
	created_at=?,
	updated_at=?,
	deleted_at=?,

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

	Email    string `json:"email"`
	Name     string `json:"username"`
	Password string `json:"-"`

	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Description string `json:"description"`
	Location    string `json:"location"`
	Picture     string `json:"picture"`
}

// Picture generates the picture url of a profile picture
func Picture(email string) string {
	hash := md5.Sum([]byte(strings.ToLower(email)))
	return "https://www.gravatar.com/avatar/" + fmt.Sprintf("%x", hash)
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
