package models

import (
	"crypto/md5"
	"fmt"
	"strings"

	"github.com/jinzhu/gorm"
)

// UserType is a custom type used to index users/organizations
type UserType uint8

const (
	// TUser is the user type
	TUser UserType = 0

	// TOrganization is the organization type
	TOrganization UserType = 1
)

// User is the database model for a user
type User struct {
	Base
	Type UserType `json:"type"`

	Email    string `gorm:"type:varchar(100);unique_index" json:"email"`
	Username string `gorm:"type:varchar(32);unique_index" json:"username"`
	Password string `json:"-"`

	Firstname   string `gorm:"type:varchar(50)" json:"firstname"`
	Lastname    string `gorm:"type:varchar(50)" json:"lastname"`
	Description string `gorm:"type:varchar(250)" json:"description"`
	Location    string `gorm:"type:varchar(100)" json:"location"`
	Picture     string `json:"picture"`

	Users         []User       `gorm:"many2many:organizations;association_jointable_foreignkey:subuser_uuid" json:"users"`
	Organizations []User       `gorm:"many2many:organizations;foreignkey:subuser_uuid" json:"organizations"`
	Repositories  []Repository `gorm:"foreignkey:OwnerName;association_foreignkey:Username" json:"repositories"`
}

// Picture generates the picture url of a profile picture
func Picture(email string) string {
	hash := md5.Sum([]byte(strings.ToLower(email)))
	return "https://www.gravatar.com/avatar/" + fmt.Sprintf("%x", hash)
}

// BeforeSave will generate the profile picture url from gravatar
func (user *User) BeforeSave(scope *gorm.Scope) error {
	return scope.SetColumn("Picture", Picture(user.Email))
}
