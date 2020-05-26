package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// SettingsErr renders the settings page with an error
func SettingsErr(w http.ResponseWriter, r *http.Request, user interface{}, msg string) {
	quercia.Render(w, r, "settings", data.Compose(
		r,
		data.Base,
		ProfileData(user),
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}
