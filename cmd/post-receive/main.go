package main

import (
	"bufio"
	"flag"
	"os"

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
	scanner := bufio.NewScanner(os.Stdin)
	stdin := ""
	for scanner.Scan() {
		stdin += scanner.Text()
	}
	if err := scanner.Err(); err != nil {
		log.Fatal().Err(err).Msg("Could not read input from stdin")
	}

	log.Info().
		Str("dir", dir).
		Strs("arguments", os.Args).
		Str("stdin", stdin).
		Msg("Calling post-receive")
}
