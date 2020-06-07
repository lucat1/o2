package routes

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/routes/shared"
	"github.com/lucat1/quercia"
	"github.com/rs/zerolog/log"
	uuid "github.com/satori/go.uuid"
)

// Feed renders a feed of git events in the homepage
func Feed(w http.ResponseWriter, r *http.Request) {
	// find the page, support request parameter
	s := muxie.GetParam(w, "page")
	var page int
	if len(s) > 0 {
		p, err := strconv.Atoi(s)
		if err != nil {
			shared.NotFound(w, r)
			return
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

		shared.NotFound(w, r)
		return
	}

	quercia.Render(w, r, "feed", data.Compose(r, data.Base, data.WithAny("events", events)))
}
