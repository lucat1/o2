package main

import (
	"flag"
	"fmt"

	"github.com/lucat1/o2/pkg/log"
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
	user := &models.User{
		Email:    "test@gmail.com",
		Name:     "test",
		Password: "test",
	}

	if err := user.Insert(); err != nil {
		log.Fatal().Err(err).Msg("Couldn't save user into the database")
	}

	user.Firstname = "Te"
	user.Lastname = "st"

	if err := user.Update(); err != nil {
		log.Fatal().Err(err).Msg("Couldn't update user into the database")
	}

	u, err := models.FirstUser("uuid", user.UUID)
	if err != nil {
		log.Fatal().Err(err).Msg("Couldn't query for user by its id")
	}

	fmt.Println(u)

	u, err = models.FirstUser("name", user.Name)
	if err != nil {
		log.Fatal().Err(err).Msg("Couldn't query for user by its name")
	}

	fmt.Println(u)
}
