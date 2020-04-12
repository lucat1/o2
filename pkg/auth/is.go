package auth

import "net/http"

// IsAuthenticated checks if the incoming request is properly authenticated
func IsAuthenticated(r *http.Request) bool {
	_, err := r.Cookie("token")
	if err != nil {
		return false
	}

	return true
}