package models

import (
	uuid "github.com/satori/go.uuid"
)

const insertRepositroy = `
INSERT INTO users () VALUES ()
`

// Repository is the database model for a git repository
type Repository struct {
	Base

	OwnerName string    `json:"owner"`
	OwnerUUID uuid.UUID `json:"-"`

	Name        string `json:"name"`
	Description string `json:"description"`

	// Permissions []Permission `gorm:"foreignkey:Resource;association_foreignkey:UUID" json:"-"`
}
