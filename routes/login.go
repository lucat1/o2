package routes

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

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
	//email := r.Form.Get("email")
	//password := r.Form.Get("password")

	quercia.Redirect(w, r, "/", "index", data.Compose(r, data.Base))
}
