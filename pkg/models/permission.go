package models

import (
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
)

// Permission is the database model for a permission to acess a resource
type Permission struct {
	For   string `gorm:"primary_index" json:"for"`
	Scope string `gorm:"primary_index" json:"resource"`

	Owner    Repository `gorm:"foreignkey:Resource;association_foreignkey:ComputedName" json:"-"`
	Resource string     `gorm:"primary_index" json:"owner"`
}

// HasPex checks if the user (`who`) has access to the requested scopes on the resource
func HasPex(who string, resource string, scopes []string) bool {
	permissions := []Permission{}
	if err := store.GetDB().
		Where(&Permission{Resource: resource}).
		Find(&permissions).Error; err != nil {
		log.Error().
			Err(err).
			Str("resource", resource).
			Msg("Error while checking permissions")

		// we return false cause we cannot guarantee that
		//the user has the requested permissions
		return false
	}

	matching := 0
	for _, pex := range permissions {
		for _, scope := range scopes {
			if pex.Scope == scope && (pex.For == who || pex.For == "*") {
				matching++
				break
			}
		}
	}

	return matching == len(scopes)
}
