package store

import (
	"os"
	"os/exec"

	"github.com/lucat1/o2/pkg/log"
)

var (
	// PostReceiveHook is the path to the post-receive-hook command
	PostReceiveHook string
)

// InitHooks initializes the hooks paths
func InitHooks() {
	output, err := exec.Command("which", "o2-post-receive").Output()
	if err != nil {
		log.Fatal().
			Err(err).
			Str("path", os.Getenv("PATH")).
			Msg("Could not find `o2-post-receive` hook")
	}
	if len(output) == 0 {
		log.Fatal().
			Str("path", os.Getenv("PATH")).
			Bytes("output", output).
			Msg("Could not find `o2-post-receive` hook")
	}

	PostReceiveHook = string(output)[:len(output)-1]
	log.Debug().
		Str("post-receive", PostReceiveHook).
		Msg("Found hooks")
}
