package git

import (
	"os"
	"os/exec"

	"github.com/lucat1/o2/pkg/log"
)

// FIXME: TODO: Maybe just merge this and lots of other functions with the git package??

func gitCommand(dir string, version string, args ...string) []byte {
	command := exec.Command("git", args...)
	if len(version) > 0 {
		command.Env = append(os.Environ(), "GIT_PROTOCOL="+version)
	}
	command.Dir = dir
	out, err := command.Output()

	if err != nil {
		log.Error().Strs("args", args).Str("verion", version).Str("dir", dir).Msg("Error while executing git smart http command")
	}

	return out
}
