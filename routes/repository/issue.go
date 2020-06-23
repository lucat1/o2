package repository

import (
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/render"
	"github.com/lucat1/o2/routes/datas"
	"github.com/lucat1/o2/routes/shared"
)

func IssueRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	rawID := muxie.GetParam(w, "id")
	id, err := strconv.Atoi(rawID)
	issue, err := models.GetIssue(repo.UUID, id)
	if err != nil {
		log.Error().
			Err(err).
			Str("repository", repo.UUID.String()).
			Str("raw_id", rawID).
			Int("id", id).
			Msg("Could not find issue")

		return shared.NotFoundRenderer(w, r)
	}

	comments, err := models.SelectIssueComments(id)
	if err != nil {
		log.Error().
			Err(err).
			Int("issue", id).
			Msg("Could not get issue comments")

		return shared.NotFoundRenderer(w, r)
	}

	if r.Method != http.MethodPost {
		return render.Result{
			Page: "repository/issue",
			Composers: []data.Composer{
				datas.RepositoryData(repo),
				data.WithAny("issue", issue),
				data.WithAny("comments", comments),
			},
		}
	}

	// ignore unauthenticated POSTs as they cannot comment under issues
	if !auth.IsAuthenticated(r) {
		return shared.NotFoundRenderer(w, r)
	}

	// handle comments creation
	author := r.Context().Value(auth.AccountKey).(*models.User)
	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	body := r.Form.Get("body")

	comment := models.IssueComment{
		Issue:   issue.ID,
		Author:  author.UUID,
		Picture: author.Picture,
		Body:    body,
	}
	if err := comment.Insert(); err != nil {
		log.Error().
			Err(err).
			Int64("issue", issue.ID).
			Str("author", author.UUID.String()).
			Str("body", body).
			Msg("Could not add a comment to the issue")

		return shared.NotFoundRenderer(w, r)
	}

	return render.Result{
		Page: "repository/issue",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issue", issue),
			data.WithAny("comments", append(comments, comment)),
		},
	}
}

func Issue(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, IssueRenderer)
}
