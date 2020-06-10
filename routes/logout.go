package routes

import (
	"context"
	"net/http"
	"time"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/render"
)

// LogoutRenderer returns the page and the render data to logout a user
var LogoutRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	return render.WithRedirect(FeedRenderer(w, r), "/")
}

// Logout deletes the `token` cookie and redirects the user to the index page
func Logout(w http.ResponseWriter, r *http.Request) {
	// unset the cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Now(),
		MaxAge:  0,
	})
	*r = *r.WithContext(context.WithValue(r.Context(), auth.ClaimsKey, nil))

	render.Render(w, r, LogoutRenderer)
}
