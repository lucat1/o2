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
		quercia.Render(w, r, "register", data.Compose(r, data.Base))
		return
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	name := r.Form.Get("name")
	email := r.Form.Get("email")
	password := r.Form.Get("password")

	if name == "" || email == "" || password == "" {
		datas.RegisterErr(w, r, "Please fill in all the required fields")
		return
	}

	user := models.User{
		Type:  models.UserType,
		Email: email,
		Name:  name,
	}
	token, err := auth.Register(&user, password)

	if err != nil {
		datas.RegisterErr(w, r, err.Error())
		return
	}

	r = auth.SetCookie(w, r, token)
	events, _ := models.SelectVisileEvents(user.UUID, 20, 0)
	quercia.Redirect(w, r, "/", "feed", data.Compose(r, data.Base, data.WithAny("events", events)))
}
