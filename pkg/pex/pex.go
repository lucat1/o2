package pex

import (
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	uuid "github.com/satori/go.uuid"
)

// Can queries the database to check if a user can run an action
func Can(resource uuid.UUID, who uuid.UUID, scopes []string) bool {
	pexes, err := models.FindPermissions(resource, who, scopes)
	if err != nil {
		log.Error().
			Err(err).
			Str("resource", resource.String()).
			Str("who", who.String()).
			Strs("scopes", scopes).
			Msg("Could not fetch permissions to check for access")

		// cannot be certain the user has permission. Say no in case of doubt
		return false
	}

	return len(pexes) == len(scopes)
}
