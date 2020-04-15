package routes

import (
	"net/http"
	"time"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
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
	quercia.Redirect(w, r, "/", "index", data.Compose(r))
}
