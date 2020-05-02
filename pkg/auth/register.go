package auth

import (
	"errors"

	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

func exists(user models.User) bool {
	var dummy models.User
	if err := store.GetDB().Where(&user).First(&dummy).Error; err != nil {
		return false
	}

	return true
}

// Register creates a new database instance of the given user
func Register(user models.User, password string) (string, error) {
	if exists(models.User{Username: user.Username}) {
		return "", errors.New("The username is taken")
	}

	if exists(models.User{Email: user.Email}) {
		return "", errors.New("The email is already in use for another account")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("Internal error. Please retry with a different password")
	}

	user.Password = string(hashed)

	if err := store.GetDB().Save(&user).Error; err != nil {
		log.Error().Err(err).Msg("Error while registering new user")
		return "", errors.New("Internal error. Please try again later")
	}

	return Token(user)
}
