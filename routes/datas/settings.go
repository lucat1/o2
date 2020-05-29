package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// SettingsError renders a settings page with an error
func SettingsError(w http.ResponseWriter, r *http.Request, page, msg string) {
	quercia.Render(w, r, page, data.Compose(
		r,
		data.Base,
		ErrorData(msg),
	))
}
