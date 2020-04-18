package git

import (
	"bytes"
	"os/exec"

	"github.com/rs/zerolog/log"
)

// Command executes a git command with the given arguments in the given location
func Command(pwd string, args ...string) (buf *bytes.Buffer, err error) {
	cmd := exec.Command("git", args...)
	buf = &bytes.Buffer{}
	cmd.Stdout = buf

	if pwd != "" {
		cmd.Dir = pwd
	}

	log.Debug().
		Str("pwd", cmd.Dir).
		Strs("args", args).
		Msg("Running git command")

	err = cmd.Run()
	return
}
