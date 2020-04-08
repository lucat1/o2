package store

import (
	"flag"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var debug *bool

func init() {
	debug = flag.Bool("debug", false, "Set the loglevel to debug")
}

func initLog() {
	// UNIX Time is faster and smaller than most timestamps
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	if *debug {
		log.Info().Msg("Loglevel set to debug")
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
}
