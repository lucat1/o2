package routes

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/images"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/shared"
)

// Picture returns a profile picture for the user(identified by a hash)
func Picture(w http.ResponseWriter, r *http.Request) {
	hash := muxie.GetParam(w, "hash")
	data, err := images.Get(hash)
	if err != nil {
		log.
			Debug().
			Err(err).
			Str("hash", hash).
			Msg("Could not get profile picture")

		render.Render(w, r, shared.NotFoundRenderer)
		return
	}

	w.Header().Add("Content-Type", "image/jpeg")
	w.Write([]byte(data))
}
