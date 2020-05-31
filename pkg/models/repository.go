package models

import (
	uuid "github.com/satori/go.uuid"
)

// Repository is the database model for a git repository
type Repository struct {
	Base

	OwnerName string    `gorm:"type:varchar(32);primary_index" json:"owner"`
	OwnerUUID uuid.UUID `gorm:"type:char(36);primary_index" json:"-"`

	Name        string `gorm:"primary_index" json:"name"`
	Description string `gorm:"type:varchar(250)" json:"description"`

	Permissions []Permission `gorm:"foreignkey:Resource;association_foreignkey:UUID" json:"-"`
}
