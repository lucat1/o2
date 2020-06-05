package data

import (
	"net/http"

	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/quercia"
)

// Base generates the basic data contained in each respose, such as the login status
var Base Composer = func(r *http.Request) quercia.Props {
	if !auth.IsAuthenticated(r) {
		return quercia.Props{}
	}

	user, ok := r.Context().Value(auth.AccountKey).(*models.User)
	// not logged indeed
	if !ok {
		return quercia.Props{}
	}

	return quercia.Props{
		"account": quercia.Props{
			"email":    user.Email,
			"username": user.Name,
			"picture":  user.Picture,
		},
	}
}
