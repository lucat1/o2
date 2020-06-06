package main

import (
	"encoding/json"
	"flag"
	"os"
	"path"
	"time"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/models"
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
	gitDir := os.Getenv("GIT_DIR")
	dir := path.Join(store.GetCwd(), gitDir)

	// read stdin data
	previous, next, ref := parseStdin()

	log.Info().
		Str("dir", dir).
		Strs("arguments", os.Args).
		Str("previous", previous).
		Str("next", next).
		Str("ref", ref).
		Msg("Called post-receive")

	// get commits
	repo := findRepository(dir)
	dbRepo := findDatabaseRepository(dir)
	commits := findCommits(repo, previous, next)
	log.Info().
		Strs("commits", commitsHashes(commits)).
		Msg("Found commits")

	raw, _ := json.Marshal(map[string]interface{}{
		"commits": commits.Commits,
	})
	// push the action to the database
	event := models.Event{
		Time:     time.Now(),
		Type:     models.CommitEvent,
		Resource: dbRepo.UUID,
		Data:     raw,
	}

	if err := event.Insert(); err != nil {
		log.Fatal().Err(err).Msg("Could not save event in the database")
	}

	log.Info().Msg("Successfully saved event in databases")
}
