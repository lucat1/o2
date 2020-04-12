package routes

import (
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/quercia"
)

func registerDataErr(err string) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"error": err,
		}
	}
}

func registerErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "register", data.Compose(
		r,
		data.Base,
		registerDataErr(msg),
	))
}

// Register renders the register page
func Register(w http.ResponseWriter, r *http.Request) {
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

	if models.ExistsUser(models.User{Username: username}) {
		registerErr(w, r, "The username is taken")
		return
	}

	if models.ExistsUser(models.User{Email: email}) {
		registerErr(w, r, "The email is already in use for another account")
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		registerErr(w, r, "Internal error. Please retry with a different password")
		return
	}

	user := models.User{
		Email:    email,
		Username: username,
		Password: string(hashed),
	}

	if err := store.GetDB().Save(&user).Error; err != nil {
		registerErr(w, r, "Internal server error. Please retry")
		return
	}

	//quercia.Redirect
	quercia.Render(w, r, "register", data.Compose(r, data.Base))
}
