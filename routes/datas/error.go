package datas

import (
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/quercia"
)

// ErrorData composes an error into the json object
func ErrorData(msg string) data.Composer {
	return func(r *http.Request) quercia.Props {
		return quercia.Props{
			"error": msg,
		}
	}
}
