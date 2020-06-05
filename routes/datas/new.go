package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// NewErr renders the `new` page with an error
func NewErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "new", data.Compose(
		r,
		data.Base,
		ErrorData(msg),
	))
}
