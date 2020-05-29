package store

import (
	"github.com/jinzhu/gorm"
	"github.com/rs/zerolog/log"

	// mysql driver for gorm
	_ "github.com/jinzhu/gorm/dialects/mysql"

	// sqlite driver for gorm
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	// postgres driver for gorm
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var database *gorm.DB

func initDB() {
	dialect := config.Section("database").Key("dialect").String()
	uri := config.Section("database").Key("uri").String()
	log.Debug().
		Str("dialect", dialect).
		Str("uri", uri).
		Msg("Opening to database")

	// connection URI format: user:password@(localhost)/dbname?charset=utf8&parseTime=True&loc=Local
	db, err := gorm.Open(dialect, uri)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not connect to database")
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8mb4 auto_increment=1")

	// eanble gorm logging mode on debug
	if *debug {
		db.LogMode(true)
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
