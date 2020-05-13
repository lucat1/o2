package models

import (
	"github.com/jinzhu/gorm"
)

// Repository is the database model for a git repository
type Repository struct {
	Model
	ComputedName string `gorm:"unique_index" json:"-"`

	OwnerName string `gorm:"type:varchar(36);primary_index" json:"owner"`

	Name        string `gorm:"primary_index" json:"name"`
	Description string `gorm:"type:varchar(250)" json:"description"`

	Permissions []Permission `gorm:"foreignkey:Resource;association_foreignkey:ComputedName" json:"-"`
}

// BeforeSave updates the `ComputedName` value of the repository
func (repo *Repository) BeforeSave(scope *gorm.Scope) error {
	return scope.SetColumn("ComputedName", repo.OwnerName+"/"+repo.Name)
}
