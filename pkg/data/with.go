package data

import (
	"net/http"

	"github.com/lucat1/quercia"
)

// WithAny is a composer to assing any value to a string key(key->value)
func WithAny(key string, value interface{}) Composer {
	return func(r *http.Request) quercia.Props {
		res := quercia.Props{}
		res[key] = value
		return res
	}
}
