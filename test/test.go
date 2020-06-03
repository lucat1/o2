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
	user1 := &models.User{
		Email:     "test1@gmail.com",
		Name:      "test1",
		Password:  "test1",
		Firstname: "ab",
	}

	user2 := &models.User{
		Email:     "test2@gmail.com",
		Name:      "test2",
		Password:  "test2",
		Firstname: "ab",
	}

	if err := user1.Insert(); err != nil {
		log.Fatal().Err(err).Msg("Couldn't save user1 into the database")
	}

	if err := user2.Insert(); err != nil {
		log.Fatal().Err(err).Msg("Couldn't save user2 into the database")
	}

	users, err := models.SelectUsers("firstname", "ab")
	if err != nil {
		log.Fatal().Err(err).Msg("Couldn't query for userS by THEIR firstnameS")
	}

	fmt.Println(users)

	repo := models.Repository{
		OwnerName: user1.Name,
		OwnerUUID: user1.UUID,

		Name: "test",
	}

	if err := repo.Insert(); err != nil {
		log.Fatal().Err(err).Msg("Couldn't save repo into the database")
	}
}
