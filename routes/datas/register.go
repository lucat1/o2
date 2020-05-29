package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// RegisterErr renders the register page with an error
func RegisterErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "register", data.Compose(
		r,
		data.Base,
		ErrorData(msg),
	))
}
