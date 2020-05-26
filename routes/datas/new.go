package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

// NewData composes the data for the `new` page
func NewData(user models.User) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"user": user,
		}
	}
}

// NewErr renders the `new` page with an error
func NewErr(w http.ResponseWriter, r *http.Request, msg string) {
	quercia.Render(w, r, "new", data.Compose(
		r,
		data.Base,
		func(r *http.Request) quercia.Props {
			return quercia.Props{
				"error": msg,
			}
		},
	))
}
