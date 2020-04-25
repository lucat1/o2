package git

import (
	"net/http"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/o2/routes"
	"github.com/rs/zerolog/log"
)

// InfoRefs handles the request for the repository's
// refs, branch names and commit hashes
func InfoRefs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		routes.NotFound(w, r)
		return
	}

	// TODO: Check if the user has access!

	username := muxie.GetParam(w, "username")
	reponame := muxie.GetParam(w, "reponame")
	log.Debug().
		Str("username", username).
		Str("reponame", reponame).
		Msg("Handling git info refs")

	dir := git.GetPath(username, reponame)
	serviceName := getServiceType(r)
	version := r.Header.Get("Git-Protocol")

	//if access {
	refs := gitCommand(dir, version, serviceName, "--stateless-rpc", "--advertise-refs", dir)

	headerNoCache(w)
	w.Header().Add("Content-Type", "application/x-git-"+serviceName+"-advertisement")
	w.WriteHeader(http.StatusOK)
	if len(version) == 0 {
		// provide a valid git version if none is provided
		w.Write(packetWrite("# service=git-" + serviceName + "\n"))
		w.Write(packetFlush())
	}
	w.Write(refs)
	//} else {
	//	updateServerInfo(dir)
	//	hdrNocache(c)
	//	sendFile("text/plain; charset=utf-8", c)
	//}
}