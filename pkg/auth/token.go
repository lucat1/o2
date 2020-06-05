package auth

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

// Claims is the struct serialized into the JWT
type Claims struct {
	UUID uuid.UUID `json:"uuid"`

	jwt.StandardClaims
}

// the lifespan of the token
const lifespan = 8 * time.Hour

// Token generates a login JWT for the requested user
func Token(user models.User) (string, error) {
	claims := &Claims{
		UUID: user.UUID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(lifespan).Unix(),
		},
	}

	key := store.GetConfig().Section("o2").Key("jwt_key").String()
	_token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := _token.SignedString([]byte(key))
	if err != nil {
		return "", errors.New("JWT: " + err.Error())
	}

	return token, nil
}

// SetCookie sets the cookie on the connection
func SetCookie(w http.ResponseWriter, r *http.Request, token string) *http.Request {
	cookie := &http.Cookie{
		Name:    "token",
		Value:   token,
		MaxAge:  int(lifespan),
		Expires: time.Now().Add(lifespan),
	}

	// set the cookie and then add the data to the context
	http.SetCookie(w, cookie)

	claims, _ := _isAuthenticated(token)
	user, _ := models.GetUser("uuid", claims.UUID)
	return r.WithContext(context.WithValue(
		context.WithValue(r.Context(), AccountKey, &user),
		ClaimsKey, claims),
	)
}
