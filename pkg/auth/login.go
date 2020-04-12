package auth

import "github.com/lucat1/o2/pkg/models"

// Login generates a login token for the requested user
func Login(user models.User) (string, error) {
	return "test_token", nil
}
