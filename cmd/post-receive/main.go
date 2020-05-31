package main

import (
	"flag"
	"os"

	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/store"
)

func init() {
	flag.Parse()
	logsPath := os.Getenv("LOGSPATH")

	// initialize the logger, store and database
	store.Init()

	// store logs only in a file. Don't print anything to the client
	file, err := os.OpenFile(logsPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not open log file")
	}
	log.Output(file)
}

func main() {
	dir := os.Getenv("GIT_DIR")
	log.Info().
		Str("dir", dir).
		Strs("arguments", os.Args).
		Strs("environment", os.Environ()).
		Msg("Calling post-receive")
}
