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
	uuid CHAR(36) UNIQUE NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	type CHAR(12) NOT NULL,
	email VARCHAR(100) UNIQUE,
	name 	VARCHAR(32) UNIQUE NOT NULL,
	password TEXT,

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
	uuid CHAR(36) UNIQUE NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	owner_uuid CHAR(36) NOT NULL,
	owner_name VARCHAR(32) NOT NULL,
	name 	VARCHAR(32) NOT NULL,
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
	INDEX (resource),

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
	type VARCHAR(100) NOT NULL,
	data TEXT NOT NULL,

	PRIMARY KEY (id, resource),
	INDEX (resource),

	FOREIGN KEY (resource)
		REFERENCES repositories(uuid)
		ON UPDATE CASCADE ON DELETE CASCADE
)
`

const createIssue = `
create table if not exists issues (
	id int not null auto_increment,
	created_at datetime not null,
	updated_at datetime not null,
	deleted_at datetime null,

	repository char(36) not null,
	author char(36) not null,
	relative_id int not null,
	title varchar(255) not null,

	primary key (id, repository, relative_id),
	index (repository),

	foreign key (repository)
		references repositories(uuid)
		on update cascade on delete cascade,

	foreign key (author)
		references users(uuid)
		on update cascade on delete cascade
)
`

const createIssueComment = `
create table if not exists issue_comments (
	id int not null auto_increment,
	created_at datetime not null,
	updated_at datetime not null,
	deleted_at datetime null,
	
	issue int NOT NULL,
	author CHAR(36) NOT NULL,
	body TEXT NOT NULL,

	primary key (id, issue),
	index (id),

	foreign key (issue)
		references issues(id)
		on update cascade on delete cascade,

	foreign key (author)
		references users(uuid)
		on update cascade on delete cascade
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

	_, err = store.GetDB().Exec(createIssue + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `issues` table")
	}

	_, err = store.GetDB().Exec(createIssueComment + collation)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not create the `issue_comments` table")
	}
}
