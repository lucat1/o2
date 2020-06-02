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

const firstUser = `
	SELECT * FROM users WHERE %s=? AND deleted_at IS NULL
`

// User is the database model for a user
type User struct {
	Base

	Email    string `gorm:"type:varchar(100);unique_index" json:"email"`
	Name     string `gorm:"type:varchar(32);primary_key" json:"username"`
	Password string `json:"-"`

	Firstname   string `gorm:"type:varchar(50)" json:"firstname"`
	Lastname    string `gorm:"type:varchar(50)" json:"lastname"`
	Description string `gorm:"type:varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci" json:"description"`
	Location    string `gorm:"type:varchar(100)" json:"location"`
	Picture     string `json:"picture"`

	Organizations []Organization `gorm:"many2many:user_orgs;" json:"organizations"`
	Repositories  []Repository   `gorm:"polymorphic:Owner" json:"repositories"`
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

// FirstUser returns the first user found when querying the database
// with the given field and value pair
func FirstUser(field string, value interface{}) (u User, err error) {
	err = store.GetDB().Get(&u, fmt.Sprintf(firstUser, field), value)
	return
}
