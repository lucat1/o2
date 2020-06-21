package repository

import (
	"fmt"
	"net/http"
	"strconv"

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

	if r.Method != "POST" {
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

	issue := models.Issue{
		Repository: repo.UUID,
		RelativeID: id,
		Author:     author.UUID,
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

	return render.Result{
		Redirect: "/" + repo.OwnerName + "/" + repo.Name + "/issue/" + strconv.Itoa(int(id)),
		Page:     "repository/issue",
		Composers: []data.Composer{
			datas.RepositoryData(repo),
			data.WithAny("issue", issue),
		},
	}
}

func NewIssue(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, NewIssueRenderer)
}
