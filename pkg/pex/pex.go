package pex

import (
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	uuid "github.com/satori/go.uuid"
)

// Pex is a struct that holds the data fetched from the db so we can
// compute if authentication is required and if the user has acces to a scope
type Pex struct {
	RequiresAuth bool
	Permission   models.Permission
}

// SelectPexes queries the database and produces an array of permissions for the
// requested resource with the requested scopes
func SelectPexes(resource uuid.UUID, scopes []string) []Pex {
	perms, err := models.SelectPermissionsWithScopes(resource, scopes)
	if err != nil {
		log.Error().
			Err(err).
			Str("resource", resource.String()).
			Strs("scopes", scopes).
			Msg("Error while selecting permissions")

		// we return false cause we cannot guarantee that
		//the user has the requested permissions
		return []Pex{}
	}

	return ToPex(perms)
}

// ToPex transforms an array of Permissions in to Pexes
func ToPex(permissions []models.Permission) (res []Pex) {
	for _, permission := range permissions {
		res = append(res, Pex{
			RequiresAuth: uuid.Equal(permission.Beneficiary, uuid.Nil),
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
func HasPex(permissions []Pex, who uuid.UUID, scopes []string) bool {
	matching := 0
	for _, permission := range permissions {
		pex := permission.Permission
		for _, scope := range scopes {
			if pex.Scope == scope && (uuid.Equal(pex.Beneficiary, who) || !permission.RequiresAuth) {
				matching++
				break
			}
		}
	}

	return matching == len(scopes)
}
