package git

import (
	"errors"
	"os"

	"github.com/go-git/go-git/v5"
)

// Repository is the struct that holds the data for the repository
type Repository struct {
	// TODO: remove
	Path string

	repo *git.Repository
}

// Get returns the repository object for the given bare repo
func Get(uuid string) (*Repository, error) {
	path := GetPath(uuid)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, errors.New("The git repository at the given path does not exist")
	}
	repo, err := git.PlainOpen(path)
	if err != nil {
		return nil, err
	}

	return &Repository{repo}, nil
}
