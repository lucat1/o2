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

// Pex is a struct that holds the data fetched from the db so we can
// compute if authentication is required and if the user has acces to a scope
type Pex struct {
	RequiresAuth bool
	Permission   Permission
}

// FetchPexes queries the database and produces an array of permissions for the
// requested resource
func FetchPexes(resource string) ([]Pex, bool) {
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
		return []Pex{}, false
	}

	return ToPex(permissions), true
}

// ToPex transforms an array of Permissions in to Pexes
func ToPex(permissions []Permission) (res []Pex) {
	for _, permission := range permissions {
		res = append(res, Pex{
			RequiresAuth: permission.For != "*",
			Permission:   permission,
		})
	}
	return
}

// HasAll checks if the permissions array contains all the required scopes
func HasAll(permissions []Pex, scopes []string) bool {
	matching := 0
	for _, permission := range permissions {
		for _, scope := range scopes {
			if permission.Permission.Scope == scope {
				matching++
				break
			}
		}
	}

	return matching == len(scopes)
}

// HasPex checks if the user (`who`) has access to the requested scopes on the resource
func HasPex(permissions []Pex, who string, scopes []string) bool {
	matching := 0
	for _, permission := range permissions {
		pex := permission.Permission
		for _, scope := range scopes {
			if pex.Scope == scope && (pex.For == who || !permission.RequiresAuth) {
				matching++
				break
			}
		}
	}

	return matching == len(scopes)
}
