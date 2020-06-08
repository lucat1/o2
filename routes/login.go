package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
)

// LoginRenderer returns the page and the render data for login
var LoginRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	// ignore already logged-in users - redirect to home(feed)
	if auth.IsAuthenticated(r) {
		return render.WithRedirect(FeedRenderer(w, r), "/")
	}

	if r.Method != "POST" {
		return render.Result{
			Page: "login",
			Data: data.Compose(r, data.Base),
		}
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	email := r.Form.Get("email")
	password := r.Form.Get("password")

	if email == "" || password == "" {
		return render.Result{
			Page: "login",
			Data: data.Compose(
				r,
				data.Base,
				data.WithAny("error", "Please fill in all the required fields"),
			),
		}
	}

	user := models.User{
		Email:    email,
		Password: password,
	}
	token, err := auth.Login(&user)
	if err != nil {
		return render.Result{
			Page: "login",
			Data: data.Compose(
				r,
				data.Base,
				data.WithAny("error", err.Error()),
			),
		}
	}

	r = auth.SetCookie(w, r, token)
	if to := r.URL.Query().Get("to"); len(to) > 0 {
		return render.Result{
			Redirect: to,
			Page:     "",
			Data:     data.Compose(r, data.Base),
		}
	}

	return render.WithRedirect(FeedRenderer(w, r), "/")
}

// Login renders the login page and handles authentication
func Login(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, LoginRenderer)
}
