package auth

import (
	"errors"
	"fmt"

	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

// Login checks the given email/password and authenticates a user
func Login(user models.User) (string, error) {
	fmt.Print(user.Email)
	if !models.ExistsUser(models.User{Email: user.Email}) {
		return "", errors.New("Invalid email address")
	}

	var dbUser models.User
	if err := store.GetDB().Where("email = ?", user.Email).First(&dbUser).Error; err != nil {
		log.Error().Err(err).Msg("Could not find user during login, but the email seems to exist")
		return "", errors.New("Internal error. Please try again later")
	}

	if bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)) != nil {
		return "", errors.New("Invalid password")
	}

	return Token(dbUser)
}
