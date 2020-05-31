package git

import (
	"compress/gzip"
	"io"
	"net/http"
	"os"
	"os/exec"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes/shared"
)

// RPC is a route which spawns a git headless service
// to accept/provide incoming/outgoing packets for git
// repository poshing/pulling
func RPC(rpc string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			shared.NotFound(w, r)
			return
		}

		dbRepo := r.Context().Value(middleware.DbRepo).(models.Repository)
		username := muxie.GetParam(w, "username")
		reponame := muxie.GetParam(w, "reponame")
		log.Debug().
			Str("username", username).
			Str("reponame", reponame).
			Str("rpc", rpc).
			Msg("Handling git headless rpc")

		// preset headers for to make the request valid
		w.Header().Set("Content-Type", "application/x-git-"+rpc+"-result")
		w.Header().Set("Connection", "Keep-Alive")
		w.Header().Set("Transfer-Encoding", "chunked")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.WriteHeader(http.StatusOK)

		// build the git headless rpc command
		dir := git.GetPath(dbRepo.UUID.String())
		cmd := exec.Command("git", rpc, "--stateless-rpc", dir)
		cmd.Env = os.Environ()

		// add hooks values environment variables
		cmd.Env = append(
			cmd.Env,
			"O2_POST_RECEIVE="+store.PostReceiveHook,
			"CONFIGPATH="+*store.ConfigPath,
			"LOGSPATH="+store.GetConfig().Section("o2").Key("hooks_log").String(),
		)

		if protocol := r.Header.Get("Git-Protocol"); protocol != "" {
			cmd.Env = append(cmd.Env, "GIT_PROTOCOL="+protocol)
		}

		in, err := cmd.StdinPipe()
		if err != nil {
			log.Error().Err(err).Msg("Could not open git rpc stdin")
			internalError(w, r)
			return
		}

		out, err := cmd.StdoutPipe()
		if err != nil {
			log.Error().Err(err).Msg("Could not open git rpc stdout")
			internalError(w, r)
			return
		}

		err = cmd.Start()
		if err != nil {
			log.Error().Err(err).Msg("Error while running the git rpc service")
			internalError(w, r)
			return
		}

		var reader io.ReadCloser
		switch r.Header.Get("Content-Encoding") {
		case "gzip":
			reader, err = gzip.NewReader(r.Body)
			defer reader.Close()
		default:
			reader = r.Body
		}

		// Write the request body to the git service
		io.Copy(in, reader)
		in.Close()

		flusher, ok := w.(http.Flusher)
		if !ok {
			log.Error().Msg("expected http.ResponseWriter to be an http.Flusher while serving git rpc")
			return
		}

		p := make([]byte, 1024)
		for {
			nRead, err := out.Read(p)
			if err == io.EOF {
				break
			}

			nWrite, err := w.Write(p[:nRead])
			if err != nil {
				log.Error().Err(err).Msg("Could not write to response in git rpc")
				return
			}

			if nRead != nWrite {
				log.Error().
					Int("read", nRead).
					Int("written", nWrite).
					Msg("The umber of bytes read does not match the number of bytes written")
				return
			}

			flusher.Flush()
		}

		cmd.Wait()
	}
}
