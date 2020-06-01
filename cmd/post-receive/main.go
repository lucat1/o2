package main

import (
	"bufio"
	"flag"
	"os"

	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/store"
)

func init() {
	flag.Parse()
	logsPath := os.Getenv("LOGSPATH")

	// initialize the logger, store and database
	store.InitConfig()
	store.InitLogs()

	// store logs only in a file. Don't print anything to the client
	file, err := os.OpenFile(logsPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not open log file (post-receive)")
	}
	log.Output(file)

	store.InitDatabase()
}

func main() {
	dir := os.Getenv("GIT_DIR")

	// read stdin data
	previous, next, ref := parseStdin()

	log.Info().
		Str("dir", dir).
		Strs("arguments", os.Args).
		Str("previous", previous).
		Str("next", next).
		Str("ref", ref).
		Msg("Called post-receive")

	repo := findRepository(dir)
	commits := findCommits(repo, previous, next)
	log.Info().
		Int("commits", len(commits.Commits)).
		Msg("Found commits")
}

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
