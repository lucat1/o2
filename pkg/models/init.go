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

	type CHAR(12) NOT NULL,
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

const createRepository = `
CREATE TABLE IF NOT EXISTS repositories (
	uuid CHAR(36) NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	owner_uuid CHAR(36) UNIQUE NOT NULL,
	owner_name VARCHAR(32) UNIQUE NOT NULL,
	name 	VARCHAR(32) UNIQUE NOT NULL,
	description VARCHAR(250),

	PRIMARY KEY (uuid, owner_uuid, owner_name, name),
	INDEX (owner_uuid, owner_name),

	FOREIGN KEY (owner_uuid, owner_name)
		REFERENCES users(uuid, name)
		ON UPDATE CASCADE ON DELETE CASCADE
)
`

const createUserToOrganization = `
CREATE TABLE IF NOT EXISTS users_organizations (
	user_uuid CHAR(36) NOT NULL,
	organization_uuid CHAR(36) NOT NULL,

	PRIMARY KEY (user_uuid, organization_uuid),
	INDEX (user_uuid, organization_uuid),

	FOREIGN KEY (user_uuid)
		REFERENCES users(uuid)
		ON UPDATE CASCADE ON DELETE CASCADE,

	FOREIGN KEY (organization_uuid)
		REFERENCES users(uuid)
		ON UPDATE CASCADE ON DELETE CASCADE
)
`

const createPermission = `
CREATE TABLE IF NOT EXISTS permissions (
	beneficiary CHAR(36) NOT NULL,
	resource CHAR(36) NOT NULL,
	scope VARCHAR(100) NOT NULL,

	PRIMARY KEY (beneficiary, resource, scope),

	FOREIGN KEY (resource)
		REFERENCES repositories(uuid)
		ON UPDATE CASCADE ON DELETE CASCADE
)
`

const createEvent = `
CREATE TABLE IF NOT EXISTS events (
	id INT NOT NULL AUTO_INCREMENT,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	resource CHAR(36) NOT NULL,
	time DATETIME NOT NULL,
	kind VARCHAR(100) NOT NULL,
	data TEXT NOT NULL,

	PRIMARY KEY (id, resource)
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
			Msg("Could not create the `users` table")
	}

	_, err = store.GetDB().Exec(createUserToOrganization + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `users_organizations` table")
	}

	_, err = store.GetDB().Exec(createRepository + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `repositories` table")
	}

	_, err = store.GetDB().Exec(createPermission + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `permissions` table")
	}

	_, err = store.GetDB().Exec(createEvent + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `events` table")
	}
}
