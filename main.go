package main

import (
	// initialize zerolog
	"flag"
	"net/http"
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
	"github.com/markbates/pkger"

	"github.com/rs/zerolog/log"
)

var (
	port *int
	host *string
)

var dir pkger.Dir

func init() {
	port = flag.Int("port", 3000, "Sets the web server port")
	host = flag.String("host", "localhost", "Sets the web server host")
	flag.Parse()

	// initialize the logger, store and database
	store.Init()
	models.Init()

	// instantiate the http directory for the static files
	dir = pkger.Dir("/__quercia")
	quercia.SetDir(dir)
}

func main() {
	mux := muxie.NewMux()
	//mux.Use(auth.Middleware)
	mux.Handle("/__quercia/*", http.StripPrefix("/__quercia/", http.FileServer(dir)))

	// log requests during debug
	mux.Use(middleware.DebugMiddleware)
	mux.Use(auth.With)

	mux.HandleFunc("/", routes.Index)
	mux.HandleFunc("/register", routes.Register)
	mux.HandleFunc("/login", routes.Login)
	mux.HandleFunc("/logout", auth.Must(routes.Logout))
	mux.HandleFunc("/add", auth.Must(routes.Add))
	mux.HandleFunc("/:username", routes.Profile)

	repo := mux.Of("/:username/:reponame")
	repo.Use(middleware.WithRepo(routes.NotFound))

	// generate the resource value based on the :username/:reponame
	repo.Use(middleware.WithResource(func(w http.ResponseWriter, _ http.Request) string {
		return muxie.GetParam(w, "username") + "/" + muxie.GetParam(w, "reponame")
	}))

	repo.Use(middleware.MustPex([]string{"repo:pull"}, routes.NotFound))

	repo.HandleFunc("/", routes.Repository)
	repo.HandleFunc("/tree/:branch", routes.Tree)
	repo.HandleFunc("/tree/:branch/*path", routes.Tree)
	repo.HandleFunc("/blob/:branch/*path", routes.Blob)
	repo.HandleFunc("/commits/:branch", routes.Commits)
	repo.HandleFunc("/commits/:branch/:page", routes.Commits)
	repo.HandleFunc("/commit/:sha", routes.Commit)

	// git smart http protocol
	repo.HandleFunc("/info/refs", git.InfoRefs)
	repo.HandleFunc("/git-upload-pack", git.RPC("upload-pack"))
	repo.Handle(
		"/git-receive-pack",
		middleware.MustPex(
			[]string{"repo:push"},
			routes.NotFound,
		)(http.HandlerFunc(git.RPC("receive-pack"))),
	)

	// 404 handler
	mux.HandleFunc("/*path", routes.NotFound)

	log.Info().
		Str("host", *host).
		Int("port", *port).
		Msg("Starting web server")

	log.Fatal().
		Err(http.ListenAndServe(*host+":"+strconv.Itoa(*port), mux)).
		Msg("Could not listen on given port")
}
