package data

import (
	"net/http"

	"github.com/lucat1/quercia"
)

// Composer is a function that returns a series of props from the data obtained by ther http request
type Composer = func(r *http.Request) quercia.Props

// Compose calls all the given function and merges the results into a sigle
// `quercia.Props` map
func Compose(r *http.Request, composers ...Composer) quercia.Props {
	var res quercia.Props = quercia.Props{}
	for _, composer := range composers {
		res = merge(res, composer(r))
	}

	return res
}

// recursively merge two maps
func merge(a quercia.Props, b quercia.Props) quercia.Props {
	res := a
	for k, v := range b {
		_, isMapA := a[k].(quercia.Props)
		_, isMapB := v.(quercia.Props)
		if isMapA && isMapB {
			res[k] = merge(a[k].(quercia.Props), v.(quercia.Props))
			continue
		}

		res[k] = v
	}

	return res
}
