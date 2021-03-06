package main

import (
	"flag"
	"net/http"
	"strconv"

	"github.com/kataras/muxie"
	"github.com/lucat1/o2/pkg/auth"
	"github.com/lucat1/o2/pkg/images"
	"github.com/lucat1/o2/pkg/middleware"
	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
	"github.com/lucat1/o2/routes"
	"github.com/lucat1/o2/routes/git"
	"github.com/lucat1/o2/routes/repository"
	"github.com/lucat1/o2/routes/settings"
	"github.com/lucat1/o2/routes/shared"
	"github.com/lucat1/quercia"
	"github.com/markbates/pkger"

	"github.com/lucat1/o2/pkg/log"
)

var (
	port *int
	host *string
)

var dir pkger.Dir

func init() {
	port = flag.Int("port", 3000, "Sets the web server port")
	host = flag.String("host", "0.0.0.0", "Sets the web server host")
	flag.Parse()

	// initialize the logger, store and database
	store.InitConfig()
	store.InitLogs()
	store.InitDatabase()
	store.InitHooks()
	models.Init()
	images.Init()

	// noop to include the default config file
	pkger.Include("/data/o2.ini")

	// instantiate the http directory for the static files
	dir = pkger.Dir("/__quercia")
	quercia.SetDir(dir)
}

func main() {
	mux := muxie.NewMux()
	//mux.Use(auth.Middleware)
	mux.Handle("/__quercia/*", http.StripPrefix("/__quercia/", http.FileServer(dir)))

	// log requests during debug
	mux.Use(middleware.Scheme)
	mux.Use(middleware.Debug)
	mux.Use(auth.With)

	mux.HandleFunc("/", routes.Feed)
	mux.HandleFunc("/feed/:page", routes.Feed)
	mux.HandleFunc("/favicon.ico", shared.NotFound)
	mux.HandleFunc("/picture/:hash", routes.Picture)
	mux.HandleFunc("/register", routes.Register)
	mux.HandleFunc("/login", routes.Login)
	mux.HandleFunc("/logout", auth.Must(routes.Logout))
	mux.HandleFunc("/new", auth.Must(routes.New))
	mux.HandleFunc("/settings", auth.Must(settings.Settings))
	mux.HandleFunc("/settings/privacy", auth.Must(settings.Privacy))

	mux.HandleFunc("/:name", routes.Profile)
	repo := mux.Of("/:name/:repo")
	repo.Use(middleware.WithRepo(shared.NotFound))

	// generate the resource value based on the :name/:repo
	repo.Use(middleware.WithResource(middleware.RepositoryResource))

	repo.Use(middleware.MustPex([]string{"repo:pull"}, shared.NotFound))

	repo.HandleFunc("/", repository.Repository)
	repo.Handle(
		"/settings",
		middleware.MustPex(
			[]string{"repo:push"},
			shared.NotFound,
		)(http.HandlerFunc(repository.Settings)),
	)
	repo.HandleFunc("/tree/:branch", repository.Tree)
	repo.HandleFunc("/tree/:branch/*path", repository.Tree)
	repo.HandleFunc("/blob/:branch/*path", repository.Blob)
	repo.HandleFunc("/commits/:branch", repository.Commits)
	repo.HandleFunc("/commits/:branch/:page", repository.Commits)
	repo.HandleFunc("/commit/:sha", repository.Commit)
	repo.HandleFunc("/issues", repository.Issues)
	repo.HandleFunc("/issues/new", auth.Must(repository.NewIssue))
	repo.HandleFunc("/issue/:id", repository.Issue)

	// git smart http protocol
	repo.HandleFunc("/info/refs", git.InfoRefs)
	repo.HandleFunc("/git-upload-pack", git.RPC("upload-pack"))
	repo.Handle(
		"/git-receive-pack",
		middleware.MustPex(
			[]string{"repo:push"},
			shared.NotFound,
		)(http.HandlerFunc(git.RPC("receive-pack"))),
	)

	// 404 handler
	mux.HandleFunc("/*path", shared.NotFound)

	log.Info().
		Str("host", *host).
		Int("port", *port).
		Msg("Starting web server")

	log.Fatal().
		Err(http.ListenAndServe(*host+":"+strconv.Itoa(*port), mux)).
		Msg("Could not listen on given port")
}
