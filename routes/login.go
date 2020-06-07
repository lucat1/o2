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
		user := r.Context().Value(auth.ClaimsKey).(*auth.Claims).UUID
		events, _ := models.SelectVisileEvents(user, 20, 0)
		quercia.Redirect(
			w, r, "/", "feed",
			data.Compose(
				r, data.Base,
				data.WithAny("events", events),
			),
		)
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

	user := models.User{
		Email:    email,
		Password: password,
	}
	token, err := auth.Login(&user)
	if err != nil {
		datas.LoginErr(w, r, err.Error())
		return
	}

	to := r.URL.Query().Get("to")
	page := ""
	if to == "" {
		to = "/"
		page = "feed"
	}

	r = auth.SetCookie(w, r, token)
	events, _ := models.SelectVisileEvents(user.UUID, 20, 0)
	quercia.Redirect(w, r, to, page, data.Compose(r, data.Base, data.WithAny("events", events)))
}
