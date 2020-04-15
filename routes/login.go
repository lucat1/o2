package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

func loginErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "login", data.Compose(
		r,
		data.Base,
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}

// Login renders the login page and handles authentication
func Login(w http.ResponseWriter, r *http.Request) {
	// ignore already logged-in users
	if _, is := auth.IsAuthenticated(r); is {
		quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
		return
	}

	if r.Method != "POST" {
		quercia.Render(w, r, "login", data.Compose(r, data.Base))
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	email := r.Form.Get("email")
	password := r.Form.Get("password")

	if email == "" || password == "" {
		loginErr(w, r, "Please fill in all the required fields")
		return
	}

	token, err := auth.Login(models.User{
		Email:    email,
		Password: password,
	})
	if err != nil {
		loginErr(w, r, err.Error())
		return
	}

	auth.SetCookie(w, r, token)
	quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
}
