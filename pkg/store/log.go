package store

import (
	"flag"
	"io"
	"os"
	"path"

	"github.com/lucat1/o2/pkg/log"
	"github.com/rs/zerolog"
)

var (
	// HooksLogsPath is the path to the hooks logs
	HooksLogsPath string
	debug         *bool
)

func init() {
	debug = flag.Bool("debug", false, "Set the loglevel to debug")
}

// InitLogs initialzes the custom zerolog logger
func InitLogs() {
	// Resolve the path for the hooks logs used by git hooks
	HooksLogsPath = config.Section("o2").Key("hooks_log").String()
	if !path.IsAbs(HooksLogsPath) {
		HooksLogsPath = path.Join(cwd, HooksLogsPath)
	}

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
