package actions

import (
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
)

// GetProfile queries the database for a user/organization
func GetProfile(name string) (*models.User, *models.Organization) {
	user, err := models.GetUser("name", name)
	if err != nil {
		// if no user exist with that name it may be an organization
		org, err1 := models.GetOrganization("name", name)
		if err1 != nil {
			log.Debug().
				Str("name", name).
				Err(err).
				Err(err1).
				Msg("Error while querying the DB to find a user/organization")
			return nil, nil
		}

		return nil, &org
	}

	return &user, nil
}
