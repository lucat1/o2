package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// Login renders the login page and handles authentication
func Login(w http.ResponseWriter, r *http.Request) {
	// ignore already logged-in users
	if auth.IsAuthenticated(r) {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
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
		datas.LoginErr(w, r, "Please fill in all the required fields")
		return
	}

	token, err := auth.Login(models.User{
		Email:    email,
		Password: password,
	})
	if err != nil {
		datas.LoginErr(w, r, err.Error())
		return
	}

	to := r.URL.Query().Get("to")
	page := ""
	if to == "" {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	r = auth.SetCookie(w, r, token)
	quercia.Redirect(w, r, to, page, data.Compose(r, data.Base))
}
