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

func NewIssueRenderer(w http.ResponseWriter, r *http.Request) render.Result {
	repo := r.Context().Value(middleware.DbRepo).(models.Repository)

	if r.Method != http.MethodPost {
		return render.Result{
			Page: "repository/new",
			Composers: []data.Composer{
				datas.RepositoryData(repo),
			},
		}
	}

	// gather the new issue ID
	id, err := models.GetIssueID(repo.UUID)
	if err != nil {
		log.Error().
			Err(err).
			Str("repository", repo.UUID.String()).
			Msg("Could not get the latest issue id")

		return shared.NotFoundRenderer(w, r)
	}

	// increase the new issue ID
	id++

	// the logged in user
	author := r.Context().Value(auth.AccountKey).(*models.User)

	// create a new issue with the given data
	r.ParseMultipartForm(1 * 1024 * 1024 /* 1mb */)
	title := r.Form.Get("title")
	body := r.Form.Get("body")

	issue := models.Issue{
		Repository: repo.UUID,
		RelativeID: id,
		Author:     author.UUID,
		Title:      title,
	}
	if err := issue.Insert(); err != nil {
		log.Error().
			Err(err).
			Str("title", title).
			Str("repository", repo.UUID.String()).
			Str("author", author.UUID.String()).
			Msg("Could not add a new issue to the database")

		return shared.NotFoundRenderer(w, r)
	}

	comment := models.IssueComment{
		Issue:  issue.ID,
		Author: author.UUID,
		Body:   body,
	}
	if err := comment.Insert(); err != nil {
		log.Error().
			Err(err).
			Int64("issue", issue.ID).
			Str("author", author.UUID.String()).
			Str("body", body).
			Msg("Could not create the first issue comment")

		return shared.NotFoundRenderer(w, r)
	}

	muxie.SetParam(w, "id", strconv.Itoa(int(issue.ID)))
	return render.WithRedirect(
		IssueRenderer(w, r),
		"/"+repo.OwnerName+"/"+repo.Name+"/issue/"+strconv.Itoa(int(id)),
	)
}

func NewIssue(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, NewIssueRenderer)
}
