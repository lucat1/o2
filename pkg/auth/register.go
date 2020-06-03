package auth

import (
	"errors"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"golang.org/x/crypto/bcrypt"
)

// Register creates a new database instance of the given user
func Register(user models.User, password string) (string, error) {
	if _, err := models.GetUser("name", user.Name); err == nil {
		return "", errors.New("The username is taken")
	}

	if _, err := models.GetUser("email", user.Email); err == nil {
		return "", errors.New("The email is already in use for another account")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("Internal error. Please retry with a different password")
	}

	user.Password = string(hashed)

	if err := user.Insert(); err != nil {
		log.Error().Err(err).Msg("Error while registering new user")
		return "", errors.New("Internal error. Please try again later")
	}

	return Token(user)
}
