package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// LoginErr renders the login page with an error
func LoginErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "login", data.Compose(
		r,
		data.Base,
		ErrorData(msg),
	))
}
