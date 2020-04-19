package git

import (
	"path"

	"github.com/lucat1/o2/pkg/store"
)

// GetPath returns the path to a git repository
func GetPath(username, reponame string) string {
	repos := store.GetConfig().Section("repositories").Key("directory").String()
	if !path.IsAbs(repos) {
		repos = path.Join(store.GetCwd(), repos)
	}

	return path.Join(repos, username, reponame)
}
