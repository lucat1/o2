package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
)

// RegisterRenderer returns the page and the render data for register
var RegisterRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	// ignore already logged-in users
	if auth.IsAuthenticated(r) {
		render.WithRedirect(FeedRenderer(w, r), "/")
	}

	if r.Method != "POST" {
		return render.Result{
			Page: "register",
			Tags: []string{
				render.OGPTag("title", "Login"),
				render.OGPTag("description", "Register on the o2 platform to"+
					" work on code together with your team using a fast and"+
					"seamless Git web interface",
				),
			},
		}
	}

	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	name := r.Form.Get("name")
	email := r.Form.Get("email")
	password := r.Form.Get("password")

	if name == "" || email == "" || password == "" {
		return render.Result{
			Page: "register",
			Composers: []data.Composer{
				data.WithAny("error", "Please fill in all the required fields"),
			},
		}
	}

	user := models.User{
		Type:  models.UserType,
		Email: email,
		Name:  name,
	}
	token, err := auth.Register(&user, password)
	if err != nil {
		return render.Result{
			Page:      "register",
			Composers: []data.Composer{data.WithAny("error", err.Error())},
		}
	}

	auth.SetCookie(w, r, token)
	return render.WithRedirect(FeedRenderer(w, r), "/")
}

// Register renders the register page and handles authentication
func Register(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, RegisterRenderer)
}
