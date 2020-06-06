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
	ID        int64      `json:"-"`
	CreatedAt time.Time  `db:"created_at" json:"-"`
	UpdatedAt time.Time  `db:"updated_at" json:"-"`
	DeletedAt *time.Time `db:"deleted_at" json:"-"`
}

func (model *Model) generate() {
	model.CreatedAt = time.Now()
	model.UpdatedAt = time.Now()
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
	store.GetDB().
		Set("gorm:table_options", "CHARSET=utf8mb4").
		AutoMigrate(
			&User{},
			&Repository{},
			&Permission{},
			&Organization{},
			&Event{},
		)
}
