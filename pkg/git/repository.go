package git

import (
	"errors"
	"os"
)

// Repository is the struct that holds the data for the repository
type Repository struct {
	Path string
}

// Get returns the repository object for the given bare repo
func Get(path string) (*Repository, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, errors.New("The git repository at the given path does not exist")
	}

	return &Repository{path}, nil
}
