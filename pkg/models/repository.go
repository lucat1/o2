package models

import (
	"github.com/jinzhu/gorm"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
)

// Repository is the database model for a git repository
type Repository struct {
	gorm.Model
	ComputedName string `gorm:"unique_index" json:"-"`

	Owner     User   `gorm:"foreignkey:OwnerName;association_foreignkey:Username" json:"-"`
	OwnerName string `gorm:"type:varchar(36);primary_index" json:"owner"`

	Name        string `gorm:"primary_index" json:"name"`
	Description string `gorm:"type:varchar(250)" json:"description"`

	Permissions []Permission `gorm:"foreignkey:Resource;association_foreignkey:ComputedName" json:"-"`
}

// BeforeSave updates the `ComputedName` value of the repository
func (repo *Repository) BeforeSave(scope *gorm.Scope) error {
	return scope.SetColumn("ComputedName", repo.Owner.Username+"/"+repo.Name)
}

// ExistsRepository checks for the existance of the given repository with the given owner
func ExistsRepository(user User, reponame string) bool {
	repositories := []Repository{}
	if err := store.GetDB().
		Model(&user).
		Related(&repositories, "Repositories").
		Error; err != nil {
		log.Error().
			Str("owner", user.Username).
			Err(err).
			Msg("Error while getting repositories relationship")
		return false
	}

	for _, repo := range repositories {
		if repo.Name == reponame {
			return true
		}
	}

	return false
}
