package main

import (
	// initialize zerolog
	"flag"
	"net/http"
	"path"
	"strconv"

	// initialize zerolog options
	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes"
	"github.com/lucat1/o2/routes/git"
	"github.com/lucat1/quercia"

	"github.com/rs/zerolog/log"
)

var (
	port *int
	host *string
)

var dir http.Dir

func init() {
	port = flag.Int("port", 3000, "Sets the web server port")
	host = flag.String("host", "localhost", "Sets the web server host")
	flag.Parse()

	// initialize the logger, store and database
	store.Init()
	models.Init()

	// instantiate the http directory for the static files
	dir = http.Dir(path.Join(store.GetCwd(), "__quercia"))
	quercia.SetDir(dir)
}

func main() {
	mux := muxie.NewMux()
	//mux.Use(auth.Middleware)
	mux.Handle("/__quercia/*", http.StripPrefix("/__quercia/", http.FileServer(dir)))

	// log requests during debug
	mux.Use(middleware.DebugMiddleware)

	mux.HandleFunc("/", routes.Index)
	mux.HandleFunc("/register", routes.Register)
	mux.HandleFunc("/login", routes.Login)
	mux.HandleFunc("/logout", auth.Required(routes.Logout))
	mux.HandleFunc("/add", auth.Required(routes.Add))
	mux.HandleFunc("/:username", routes.Profile)
	mux.HandleFunc("/:username/:reponame", routes.Repository)
	mux.HandleFunc("/:username/:reponame/tree/:branch", routes.Tree)
	mux.HandleFunc("/:username/:reponame/tree/:branch/*path", routes.Tree)
	mux.HandleFunc("/:username/:reponame/blob/:branch/*path", routes.Blob)
	mux.HandleFunc("/:username/:reponame/commits/:branch", routes.Commits)
	mux.HandleFunc("/:username/:reponame/commits/:branch/:page", routes.Commits)
	mux.HandleFunc("/:username/:reponame/commit/:sha", routes.Commit)

	// git smart http protocol
	mux.HandleFunc("/:username/:reponame/info/refs", git.InfoRefs)
	mux.HandleFunc("/:username/:reponame/git-upload-pack", git.RPC("upload-pack"))
	mux.HandleFunc("/:username/:reponame/git-receive-pack", git.RPC("receive-pack"))

	// 404 handler
	mux.HandleFunc("/*path", routes.NotFound)

	log.Info().
		Str("host", *host).
		Int("port", *port).
		Msg("Starting web server")

	log.Fatal().Err(http.ListenAndServe(*host+":"+strconv.Itoa(*port), mux)).Msg("Could not listen on given port")
}
