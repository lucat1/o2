package routes

import (
	"net/http"
	"time"
)

// Logout deletes the `token` cookie and redirects the user to the index page
func Logout(w http.ResponseWriter, r *http.Request) {
	// unset the cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Now(),
		MaxAge:  0,
	})
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}
