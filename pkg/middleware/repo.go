package middleware

import (
	"context"
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/actions"
	"github.com/lucat1/o2/pkg/models"
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
			db, git := actions.GetRepo(UUID, reponame)

			// save the values in the context
			ctx := context.WithValue(r.Context(), DbRepo, *db)
			ctx = context.WithValue(ctx, GitRepo, git)
			f.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
