package auth

import (
	"errors"

	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
)

// Register creates a new database instance of the given user
func Register(user models.User) (string, error) {
	if models.ExistsUser(user) {
		return "", errors.New("The username has already been taken")
	}

	if err := store.GetDB().Save(user).Error; err != nil {
		return "", err
	}

	return Login(user)
}
