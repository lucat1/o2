package auth

import (
	"errors"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"golang.org/x/crypto/bcrypt"
)

// Login checks the given email/password and authenticates a user
func Login(user models.User) (string, error) {
	find := models.User{Username: user.Username, Email: user.Email}
	if !exists(find) {
		return "", errors.New("Invalid email address")
	}

	var dbUser models.User
	if err := store.GetDB().Where(find).First(&dbUser).Error; err != nil {
		log.Error().Err(err).Msg("Could not find user during login, but the email seems to exist")
		return "", errors.New("Internal error. Please try again later")
	}

	if bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)) != nil {
		return "", errors.New("Invalid password")
	}

	return Token(dbUser)
}
