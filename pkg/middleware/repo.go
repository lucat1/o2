package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
)

type repoType string

// DbRepo is the context key for the database repository value
const DbRepo = repoType("db-repo")

// GitRepo is the context key for the fs/git repository value
const GitRepo = repoType("git-repo")

// WithRepo checks for the existance of a repo both in the file system and in the database
// and returns a 404 if they don't exist. Otherwhise these two values are available in the context
func WithRepo(fallback http.HandlerFunc) muxie.Wrapper {
	return func(f http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			owner := muxie.GetParam(w, "name")
			reponame := muxie.GetParam(w, "repo")
			repository, err := models.GetRepositoryByName(owner, reponame)
			if err != nil {
				log.Debug().
					Err(err).
					Str("owner", owner).
					Str("name", reponame).
					Msg("Error while fetching repository page")
				fallback.ServeHTTP(w, r)
				return
			}

			gitRepository, err := git.Get(repository.UUID.String())
			if err != nil {
				log.Debug().
					Err(err).
					Str("uuid", repository.UUID.String()).
					Msg("Error while looking for git repository")
				fallback.ServeHTTP(w, r)
				return
			}

			// save the values in the context
			ctx := context.WithValue(r.Context(), DbRepo, repository)
			ctx = context.WithValue(ctx, GitRepo, gitRepository)
			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
