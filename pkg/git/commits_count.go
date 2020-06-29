package git

import (
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/object"
)

func (repo Repository) CountCommits() (count int, err error) {
	ref, err := repo.repo.Head()
	if err != nil {
		return -1, err
	}

	iter, err := repo.repo.Log(&git.LogOptions{From: ref.Hash()})
	if err != nil {
		return -1, err
	}

	// iterate trough the commits and increase the count
	err = iter.ForEach(func(c *object.Commit) error {
		count++

		return nil
	})
	if err != nil {
		return -1, err
	}

	return
}
