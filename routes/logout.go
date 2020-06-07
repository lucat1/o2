package routes

import (
	"net/http"
	"time"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
	uuid "github.com/satori/go.uuid"
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

	events, _ := models.SelectVisileEvents(uuid.Nil, 20, 0)
	quercia.Redirect(w, r, "/", "feed", data.Compose(r, data.WithAny("events", events)))
}
