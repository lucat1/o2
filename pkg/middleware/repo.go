package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/rs/zerolog/log"
	uuid "github.com/satori/go.uuid"
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
			var UUID uuid.UUID
			if u, ok := r.Context().Value(User).(models.User); ok {
				UUID = u.UUID
			}
			if o, ok := r.Context().Value(User).(models.Organization); ok {
				UUID = o.UUID
			}
			reponame := muxie.GetParam(w, "reponame")

			var dbRepo models.Repository
			if err := store.GetDB().
				Preload("Permissions").
				Where(&models.Repository{OwnerUUID: UUID, Name: reponame}).
				First(&dbRepo).
				Error; err != nil {

				log.Debug().
					Str("uuid", UUID.String()).
					Str("reponame", reponame).
					Err(err).
					Msg("Error while querying the DB to render the repository page")
				fallback(w, r)
				return
			}

			repo, err := git.Get(dbRepo.UUID.String())
			if err != nil {
				log.Debug().
					Str("uuid", dbRepo.UUID.String()).
					Str("reponame", reponame).
					Err(err).
					Msg("Error while looking for repository on the filesystem")
				fallback(w, r)
				return
			}

			// save the values in the context
			ctx := context.WithValue(r.Context(), DbRepo, dbRepo)
			ctx = context.WithValue(ctx, GitRepo, repo)

			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
