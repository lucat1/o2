package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
)

type repoType string

// DbRepo is the context key for the database repository value
var DbRepo = repoType("db-repo")

// GitRepo is the context key for the fs/git repository value
var GitRepo = repoType("git-repo")

// WithRepo checks for the existance of a repo both in the file system and in the database
// and returns a 404 if they don't exist. Otherwhise these two values are available in the context
func WithRepo(NotFound http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			username := muxie.GetParam(w, "username")
			reponame := muxie.GetParam(w, "reponame")

			var dbRepo models.Repository
			if err := store.GetDB().
				Where(&models.Repository{OwnerName: username, Name: reponame}).
				First(&dbRepo).
				Error; err != nil {

				log.Debug().
					Str("username", username).
					Str("reponame", reponame).
					Err(err).
					Msg("Error while query the DB to render the repository page")
				NotFound(w, r)
				return
			}

			repo, err := git.Get(username, reponame)
			if err != nil {
				log.Debug().
					Str("username", username).
					Str("reponame", reponame).
					Err(err).
					Msg("Error while looking for repository on the filesystem")
				NotFound(w, r)
				return
			}

			// save the values in the database
			ctx := context.WithValue(r.Context(), DbRepo, dbRepo)
			ctx = context.WithValue(ctx, GitRepo, repo)

			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
