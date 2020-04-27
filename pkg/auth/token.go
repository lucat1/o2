package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
)

// Claims is the struct serialized into the JWT
type Claims struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Picture  string `json:"picture"`

	jwt.StandardClaims
}

// the lifespan of the token
const lifespan = 8 * time.Hour

// Token generates a login JWT for the requested user
func Token(user models.User) (string, error) {
	claims := &Claims{
		Email:    user.Email,
		Username: user.Username,
		Picture:  user.Picture,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(lifespan).Unix(),
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

// SetCookie sets the cookie on the connection
func SetCookie(w http.ResponseWriter, r *http.Request, token string) {
	cookie := &http.Cookie{
		Name:    "token",
		Value:   token,
		MaxAge:  int(lifespan),
		Expires: time.Now().Add(lifespan),
	}

	// set the cookie both in the client response and also in the reuqest as it
	// will be used by the `data.Base` function to get the authentication state later
	http.SetCookie(w, cookie)
	r.AddCookie(cookie)
}
