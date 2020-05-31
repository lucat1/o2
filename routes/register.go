package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/quercia"
)

// Register renders the register page and handles authentication
func Register(w http.ResponseWriter, r *http.Request) {
	// ignore already logged-in users
	if auth.IsAuthenticated(r) {
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
		datas.RegisterErr(w, r, "Please fill in all the required fields")
		return
	}

	token, err := auth.Register(models.User{
		Email: email,
		Name:  username,
	}, password)

	if err != nil {
		datas.RegisterErr(w, r, err.Error())
		return
	}

	r = auth.SetCookie(w, r, token)
	quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
}
