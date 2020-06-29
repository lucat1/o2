package git

import (
	"io/ioutil"
	"os"
	"path"

	"github.com/go-git/go-git/v5"
	"github.com/lucat1/o2/pkg/log"
)

// Init initializes a bare git repository at the given path
func Init(uuid string) (*Repository, error) {
	dir := GetPath(uuid)
	// _, err := Command("", "init", "--bare", dir)
	repo, err := git.PlainInit(dir, true)
	if err != nil {
		return nil, err
	}

	// Minimalize fs size by removing useless files (for now useless)
	if err = os.RemoveAll(path.Join(dir, "hooks")); err != nil {
		log.Error().Err(err).Msg("Error while removing info folder in new repo")
	}
	if err = os.RemoveAll(path.Join(dir, "info")); err != nil {
		log.Error().Err(err).Msg("Error while removing info folder in new repo")
	}
	if err = os.Remove(path.Join(dir, "description")); err != nil {
		log.Error().Err(err).Msg("Error while removing description file in new repo")
	}

	// setup hooks
	if err = os.Mkdir(path.Join(dir, "hooks"), 0700); err != nil {
		log.Error().Err(err).Msg("Error while creating the hooks folder in the new repo")
	}
	if err = ioutil.WriteFile(path.Join(dir, "hooks", "post-receive"), postReceiveHook, 0700); err != nil {
		log.Error().Err(err).Msg("Error while creating the `post-receive` hook in the new repo")
	}

	return &Repository{repo, dir}, nil
}
