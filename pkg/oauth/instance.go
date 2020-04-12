package oauth

import (
	"crypto/rand"
	"crypto/rsa"
	"time"

	"github.com/ory/fosite"
	"github.com/ory/fosite/compose"
	"github.com/ory/fosite/storage"
)

// This is the example storage that contains:
// * an OAuth2 Client with id "my-client" and secret "foobar" capable of all oauth2 and open id connect grant and response types.
// * a User for the resource owner password credentials grant type with username "peter" and password "secret".
//
// You will most likely replace this with your own logic once you set up a real world application.
var store = storage.NewExampleStore()

// This secret is being used to sign access and refresh tokens as well as
// authorization codes. It must be exactly 32 bytes long.
var secret = []byte("my super secret signing password")

// Provider is the fosite oauth provider instance
var Provider fosite.OAuth2Provider

func init() {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic("unable to create private key")
	}

	// check the api docs of compose.Config for further configuration options
	config := &compose.Config{
		AccessTokenLifespan: time.Minute * 30,
	}

	Provider = compose.ComposeAllEnabled(config, store, secret, privateKey)
}
