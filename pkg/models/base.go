package models

import (
	"time"

	"github.com/jinzhu/gorm"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

// Base recreates gorm.Model but with a UUID instead
// of an ID. We generate that via satori/go.uuid
type Base struct {
	UUID      uuid.UUID `gorm:"type:char(36);primary_key;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Base) BeforeCreate(scope *gorm.Scope) error {
	return scope.SetColumn("UUID", uuid.NewV4())
}

// Init initializes all the database modules
func Init() {
	store.GetDB().AutoMigrate(&User{})
}
