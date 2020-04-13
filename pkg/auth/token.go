package auth

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
)

// Claims is the struct serialized into the JWT
type Claims struct {
	Email    string `json:"email"`
	Username string `json:"username"`

	jwt.StandardClaims
}

// Token generates a login JWT for the requested user
func Token(user models.User) (string, error) {
	claims := &Claims{
		Email:    user.Email,
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(8 * time.Hour).Unix(),
		},
	}

	key := store.GetConfig().Section("").Key("jwt_key").String()
	_token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := _token.SignedString([]byte(key))
	if err != nil {
		return "", errors.New("JWT: " + err.Error())
	}

	return token, nil
}
