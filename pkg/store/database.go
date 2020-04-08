package store

import (
	"github.com/jinzhu/gorm"
	"github.com/rs/zerolog/log"

	// mysql driver for gorm
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var database *gorm.DB

func initDB() {
	uri := config.Section("").Key("db_uri").String()
	log.Debug().Str("uri", uri).Msg("Connecting to mysql with data")

	// connection URI format: user:password@(localhost)/dbname?charset=utf8&parseTime=True&loc=Local
	db, err := gorm.Open("mysql", uri)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not connect to database")
	}

	log.Info().Msg("Successfully connected to the database")
	database = db
}

// GetDB returns the current database instance
func GetDB() *gorm.DB {
	return database
}

// CloseDB closes the connection to the database
func CloseDB() error {
	return database.Close()
}
