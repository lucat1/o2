package data

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/quercia"
)

// Base generates the basic data contained in each respose, such as the login status
var Base Composer = func(r *http.Request) quercia.Props {
	data, isAuthenticated := auth.IsAuthenticated(r)
	if !isAuthenticated {
		return quercia.Props{}
	}

	return quercia.Props{
		"account": quercia.Props{
			"email":    data.Email,
			"username": data.Username,
		},
	}
}
