package routes

import (
	"fmt"
	"net/http"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/oauth"
	"github.com/lucat1/quercia"
	"github.com/ory/fosite"
)

// Authorize either renders the request for scope permissions or
// redirects the user to the requiring endpoint if the user has already accepted
func Authorize(w http.ResponseWriter, r *http.Request) {
	// This context will be passed to all methods. It doesn't fulfill a real purpose in the standard library but could be used
	// to abort database lookups or similar things.
	ctx := r.Context()

	// Let's create an AuthorizeRequest object!
	// It will analyze the request and extract important information like scopes, response type and others.
	ar, err := oauth.Provider.NewAuthorizeRequest(ctx, r)
	if err != nil {
		fmt.Println("here")
		oauth.Provider.WriteAuthorizeError(w, ar, err)
		return
	}

	// Normally, this would be the place where you would check if the user is logged in and gives his consent.
	// We're simplifying things and just checking if the request includes a valid username and password
	r.ParseForm()
	if r.Form.Get("username") != "peter" {
		quercia.Render(w, r, "authorize", data.Compose(r, data.Base))
		return
	}

	// Now that the user is authorized, we set up a session. When validating / looking up tokens, we additionally get
	// the session. You can store anything you want in it.

	// The session will be persisted by the store and made available when e.g. validating tokens or handling token endpoint requests.
	// The default OAuth2 and OpenID Connect handlers require the session to implement a few methods. Apart from that, the
	// session struct can be anything you want it to be.
	mySessionData := &fosite.DefaultSession{
		Username: r.Form.Get("username"),
	}

	// It's also wise to check the requested scopes, e.g.:
	// if authorizeRequest.GetScopes().Has("admin") {
	//     http.Error(rw, "you're not allowed to do that", http.StatusForbidden)
	//     return
	// }

	// Now we need to get a response. This is the place where the AuthorizeEndpointHandlers kick in and start processing the request.
	// NewAuthorizeResponse is capable of running multiple response type handlers which in turn enables this library
	// to support open id connect.
	response, err := oauth.Provider.NewAuthorizeResponse(ctx, ar, mySessionData)
	if err != nil {
		oauth.Provider.WriteAuthorizeError(w, ar, err)
		return
	}

	// Awesome, now we redirect back to the client redirect uri and pass along an authorize code
	oauth.Provider.WriteAuthorizeResponse(w, ar, response)
}
