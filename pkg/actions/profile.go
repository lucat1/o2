package actions

import (
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
)

// GetProfile queries the database for a user/organization
func GetProfile(name string) (*models.User, *models.Organization) {
	var (
		user models.User
		org  models.Organization
	)

	if err := store.GetDB().
		Preload("Repositories").
		Preload("Repositories.Permissions").
		Preload("Organizations").
		Where(&models.User{Name: name}).
		First(&user).
		Error; err != nil {

		// if the name is not a user check if it's an organization
		if err := store.GetDB().
			Preload("Repositories").
			Preload("Repositories.Permissions").
			Preload("Users").
			Where(&models.Organization{Name: name}).
			First(&org).
			Error; err != nil {

			log.Debug().
				Str("name", name).
				Err(err).
				Msg("Error while querying the DB to find a user/organization")
			return nil, nil
		}

		return nil, &org
	}

	return &user, nil
}
