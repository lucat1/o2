package routes

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/shared"
	"github.com/rs/zerolog/log"
	uuid "github.com/satori/go.uuid"
)

// FeedRenderer fetches the database for the user's feed and
// returns the page and data to render
var FeedRenderer render.Renderer = func(w http.ResponseWriter, r *http.Request) render.Result {
	// find the page, support request parameter
	s := muxie.GetParam(w, "page")
	var page int
	if len(s) > 0 {
		p, err := strconv.Atoi(s)
		if err != nil {
			return shared.NotFoundRenderer(w, r)
		}
		page = p
	} else {
		page = 0
	}

	user := uuid.Nil
	if auth.IsAuthenticated(r) {
		user = r.Context().Value(auth.ClaimsKey).(*auth.Claims).UUID
	}

	events, err := models.SelectVisileEvents(user, 20, page)
	if err != nil {
		log.Error().
			Err(err).
			Str("user", user.String()).
			Int("page", page).
			Msg("Could not get list of events")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "feed",
		Tags: []string{
			render.OGPTag("title", "A tiny and fast Git web ui"),
			render.OGPTag("description", "Work on code together with your team using a fast and seamless Git web interface"),
		},
		Composers: []data.Composer{data.WithAny("events", events)},
	}
}

// Feed renders a feed of git events in the homepage
func Feed(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, FeedRenderer)
}
