package git

import (
	"os"
	"path"

	"github.com/rs/zerolog/log"
)

// Init initializes a bare git repository at the given path
func Init(dir string) (*Repository, error) {
	_, err := Command("", "init", "--bare", dir)
	if err != nil {
		return nil, err
	}

	// Minimalize fs size by removing useless files (for now useless)
	// We may implement something via hooks later i think
	// TODO: Hooks?! (wekhooks also)
	if err = os.RemoveAll(path.Join(dir, "hooks")); err != nil {
		log.Error().Err(err).Msg("Error while removing hooks folder in new repo")
	}
	if err = os.RemoveAll(path.Join(dir, "info")); err != nil {
		log.Error().Err(err).Msg("Error while removing info folder in new repo")
	}
	if err = os.Remove(path.Join(dir, "description")); err != nil {
		log.Error().Err(err).Msg("Error while removing description file in new repo")
	}

	return Get(dir)
}
