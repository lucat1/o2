package store

import (
	"flag"
	"io"
	"os"

	"github.com/lucat1/o2/pkg/log"
	"github.com/rs/zerolog"
)

var debug *bool

func init() {
	debug = flag.Bool("debug", false, "Set the loglevel to debug")
}

func initLog() {
	// UNIX Time is faster and smaller than most timestamps
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	// setup a file-based and a stdout logger
	file, err := os.OpenFile(
		config.Section("o2").Key("log").String(),
		os.O_APPEND|os.O_CREATE|os.O_WRONLY,
		0644,
	)
	if err == nil {
		log.Output(io.MultiWriter(os.Stderr, file))
	} else {
		log.Debug().Err(err).Msg("Could not open log file, ignoring")
	}

	if *debug {
		log.Debug().Msg("Loglevel set to debug")
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
}
