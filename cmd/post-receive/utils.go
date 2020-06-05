package main

import (
	"bufio"
	"os"
	"path"

	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
	uuid "github.com/satori/go.uuid"
)

func parseStdin() (string, string, string) {
	scanner := bufio.NewScanner(os.Stdin)
	// scan every byte
	scanner.Split(bufio.ScanBytes)

	i := 0
	res := []string{"", "", ""}

	// split by spaces
	for scanner.Scan() {
		char := scanner.Text()
		if char == " " {
			i++
			continue
		}

		res[i] += char
	}

	if err := scanner.Err(); err != nil {
		log.Fatal().Err(err).Msg("Could not read input from stdin")
	}

	return res[0], res[1], res[2]
}

func findRepository(path string) *git.Repository {
	return &git.Repository{Path: path}
}

func findDatabaseRepository(dir string) models.Repository {
	rawUUID := path.Base(dir)
	id, err := uuid.FromString(rawUUID)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not parse UUID")
	}

	repo, err := models.GetRepositoryByUUID(id)
	if err != nil {
		log.Fatal().
			Err(err).
			Str("uuid", id.String()).
			Msg("Error while querying the DB to find a repository")
	}

	return repo
}

func findCommits(repo *git.Repository, prev, next string) git.Commits {
	commits, err := repo.Branch(prev+".."+next).Commits(0, 100)
	if err != nil {
		log.Fatal().
			Err(err).
			Str("repo", repo.Path).
			Str("prev", prev).
			Str("next", next).
			Msg("Could not find pushed commits")
	}

	return commits
}

func commitsHashes(commits git.Commits) (res []string) {
	for _, commit := range commits.Commits {
		res = append(res, commit.Commit)
	}

	return
}
