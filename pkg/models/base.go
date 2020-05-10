package models

import (
	"time"

	"github.com/jinzhu/gorm"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

// Model implements the same struct as gorm.Model but hides all sql fields
// from being exported into JSON
type Model struct {
	ID        uint       `gorm:"primary_key" json:"-"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}

// Base recreates gorm.Model but with a UUID instead
// of an ID. We generate that via satori/go.uuid
type Base struct {
	UUID      uuid.UUID  `gorm:"type:char(36);primary_key;" json:"-"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Base) BeforeCreate(scope *gorm.Scope) error {
	return scope.SetColumn("UUID", uuid.NewV4())
}

// Init initializes all the database modules
func Init() {
	store.GetDB().AutoMigrate(&User{}, &Repository{}, &Permission{})
}
