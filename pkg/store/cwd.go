package store

import (
	"os"

	"github.com/lucat1/o2/pkg/log"
)

var cwd string

func init() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal().Err(err).Msg("Could not get current working directory")
	}

	cwd = wd
}

// GetCwd returns the current working directory of the service process
func GetCwd() string {
	return cwd
}
