package models

import (
	"time"

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
	UUID      uuid.UUID  `db:"type:char(36);primary_key" json:"-"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}

func (base *Base) generate() {
	base.UUID = uuid.NewV4()
	base.CreatedAt = time.Now()
	base.UpdatedAt = time.Now()
}
