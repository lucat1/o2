package store

import (
	"flag"
	"io/ioutil"
	"os"
	"path"

	"github.com/markbates/pkger"
	"github.com/rs/zerolog/log"
	"gopkg.in/ini.v1"
)

var (
	config     *ini.File
	configPath *string
)

// load the configuration file
func init() {
	configPath = flag.String("config", "data/o2.ini", "The path to the configuration file")
}

// Init loads the configuration file and saves it into memory
func initConfig() {
	// make the path absolute by resolving it against the process cwd
	if !path.IsAbs(*configPath) {
		*configPath = path.Join(cwd, *configPath)
	}

	// initialize a basic config if none is provided
	if _, err := os.Stat(*configPath); err != nil {
		file, _ := pkger.Open("/data/o2.ini")
		contents, _ := ioutil.ReadAll(file)
		if err = ioutil.WriteFile(*configPath, contents, 0644); err != nil {
			log.Fatal().Err(err).Msg("Could not create default configuration")
		}
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
