package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func registerErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "register", data.Compose(
		r,
		data.Base,
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}

// Register renders the register page and handles authentication
func Register(w http.ResponseWriter, r *http.Request) {
	// ignore already logged-in users
	if middleware.IsAuthenticated(r) {
		quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
		return
	}

	if r.Method != "POST" {
		quercia.Render(w, r, "register", data.Compose(r, data.Base))
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	username := r.Form.Get("username")
	email := r.Form.Get("email")
	password := r.Form.Get("password")

	if username == "" || email == "" || password == "" {
		registerErr(w, r, "Please fill in all the required fields")
		return
	}

	token, err := auth.Register(models.User{
		Email:    email,
		Username: username,
	}, password)

	if err != nil {
		registerErr(w, r, err.Error())
		return
	}

	auth.SetCookie(w, r, token)
	quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
}
