package data

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/quercia"
)

// Base generates the basic data contained in each respose, such as the login status
var Base Composer = func(r *http.Request) quercia.Props {
	rawClaims := r.Context().Value(auth.ClaimsKey)
	if rawClaims == nil {
		return quercia.Props{}
	}

	claims := rawClaims.(*auth.Claims)

	return quercia.Props{
		"account": quercia.Props{
			"uuid": claims.UUID,
			// "email":    claims.Email,
			// "username": claims.Username,
			// "picture":  claims.Picture,
		},
	}
}
