package store

import (
	"flag"
	"path"

	"github.com/rs/zerolog/log"
	"gopkg.in/ini.v1"
)

var (
	config     *ini.File
	configPath *string
)

// load the configuration file
func init() {
	configPath = flag.String("config", "o2.ini", "The path to the configuration file")
}

// Init loads the configuration file and saves it into memory
func initConfig() {
	// make the path absolute by resolving it against the process cwd
	if !path.IsAbs(*configPath) {
		*configPath = path.Join(cwd, *configPath)
	}

	cfg, err := ini.Load(*configPath)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not laod configuration file")
	}

	config = cfg
}

// GetConfig returns the o2 service configuration file
func GetConfig() *ini.File {
	return config
}
