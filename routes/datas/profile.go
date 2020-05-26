package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// ProfileData composes the data for a profile(user, org)
func ProfileData(user interface{}) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"profile": user,
		}
	}
}
