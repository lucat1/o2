package main

import (
	"flag"

	"github.com/lucat1/o2/pkg/models"
	"github.com/lucat1/o2/pkg/store"
)

func init() {
	// port = flag.Int("port", 3000, "Sets the web server port")
	// host = flag.String("host", "0.0.0.0", "Sets the web server host")
	flag.Parse()

	// initialize the logger, store and database
	store.InitConfig()
	store.InitLogs()
	store.InitDatabase()
	models.Init()
}

func main() {

}