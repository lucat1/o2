package auth

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lucat1/o2/pkg/store"
)

// IsAuthenticated checks if the incoming request is properly authenticated
func IsAuthenticated(r *http.Request) (*Claims, bool) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return nil, false
	}

	// ignore empty tokens and maxAge = 0 as it
	// means that the user has logged out
	if cookie.Expires.Before(time.Now()) && cookie.Value == "" {
		return nil, false
	}

	claims := &Claims{}

	key := store.GetConfig().Section("").Key("jwt_key").String()
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil || !token.Valid {
		return nil, false
	}

	return claims, true
}
