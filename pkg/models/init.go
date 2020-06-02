package models

import (
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/store"
)

// Model:
// (
// 	id INT NOT NULL AUTO_INCREMENT,
//  created_at DATETIME NOT NULL,
//  updated_at DATETIME NOT NULL,
//  deleted_at DATETIME NULL,
//
//  PRIMARY KEY (id)
// )

// Base:
// (
// 	uuid CHAR(36) NOT NULL,
//  created_at DATETIME NOT NULL,
//  updated_at DATETIME NOT NULL,
//  deleted_at DATETIME NULL,
//
//  PRIMARY KEY (uuid)
// )

const createUser = `
CREATE TABLE IF NOT EXISTS users (
	uuid CHAR(36) NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	email VARCHAR(100) UNIQUE NOT NULL,
	name 	VARCHAR(32) UNIQUE NOT NULL,
	password TEXT NOT NULL,

	firstname VARCHAR(50),
	lastname VARCHAR(50),
	description VARCHAR(250),
	location VARCHAR(100),
	picture TEXT,

	PRIMARY KEY (uuid, name)
)
`

const collation = `
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`

// Init initializes all the database modules
func Init() {
	_, err := store.GetDB().Exec(createUser + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create user's table")
	}

	// store.GetDB().
	// 	AutoMigrate(
	// 		&Repository{},
	// 		&Permission{},
	// 		&Organization{},
	// 		&Event{},
	// 	)
}
