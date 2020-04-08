package main

import (
	// initialize zerolog
	"flag"
	"net/http"
	"strconv"

	// initialize zerolog options
	"github.com/kataras/muxie"
	"github.com/lucat1/o2.auth/routes"
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

	// instantiate the http directory for the static files
	dir = http.Dir("./__quercia")
	quercia.SetDir(dir)

	// o2log.Init()
	// db.Init()
	// users.Init()
}

func main() {
	mux := muxie.NewMux()
	//mux.Use(auth.Middleware)
	mux.Handle("/__quercia/*", http.StripPrefix("/__quercia/", http.FileServer(dir)))
	mux.HandleFunc("/", routes.Index)
	// mux.HandleFunc("/register", routes.Register)
	// mux.HandleFunc("/login", routes.Login)
	// mux.HandleFunc("/logout", externalauth.Logout)
	// mux.HandleFunc("/me", routes.Me)
	// mux.HandleFunc("/*path", routes.NotFound)

	log.Info().
		Str("host", *host).
		Int("port", *port).
		Msg("Starting web server")

	log.Fatal().Err(http.ListenAndServe(*host+":"+strconv.Itoa(*port), mux)).Msg("Could not listen on given port")
}
