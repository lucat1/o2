package auth

import (
	"errors"

	"github.com/lucat1/o2/pkg/models"
	"golang.org/x/crypto/bcrypt"
)

// Login checks the given email/password and authenticates a user
func Login(user models.User) (string, error) {
	var (
		found models.User
		err   error
	)

	if user.Email != "" {
		found, err = models.GetUser("email", user.Email)
	} else {
		// use `name` instead for git cli logins
		found, err = models.GetUser("name", user.Name)
	}

	if err != nil {
		return "", errors.New("Invalid email address")
	}

	if bcrypt.CompareHashAndPassword([]byte(found.Password), []byte(user.Password)) != nil {
		return "", errors.New("Invalid password")
	}

	return Token(found)
}
