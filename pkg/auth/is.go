package auth

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/lucat1/o2/pkg/store"
)

// IsAuthenticated checks if the incoming request is properly authenticated
func IsAuthenticated(r *http.Request) (*Claims, bool) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return nil, false
	}

	value := cookie.Value
	// ignore empty tokens as it means the user has logged out
	if value == "" {
		return nil, false
	}

	claims := &Claims{}

	key := store.GetConfig().Section("").Key("jwt_key").String()
	token, err := jwt.ParseWithClaims(value, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil || !token.Valid {
		return nil, false
	}

	return claims, true
}
