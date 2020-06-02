package models

import (
	"github.com/jmoiron/modl"
	"github.com/lucat1/o2/pkg/log"
	"github.com/lucat1/o2/pkg/store"
)

var (
	dbMap *modl.DbMap
)

// Init initializes all the database modules
func Init() {
	rawDialect := store.GetConfig().Section("database").Key("dialect").String()
	var dialect modl.Dialect
	switch rawDialect {
	case "mysql":
		dialect = modl.MySQLDialect{
			Engine:   "InnoDB",
			Encoding: "utf8mb4",
		}

	case "postgres":
		dialect = modl.PostgresDialect{}

	case "sqlite":
		dialect = modl.SqliteDialect{}

	default:
		log.Fatal().
			Str("dialect", rawDialect).
			Msg("Unsupported sql dialect")
	}

	dbMap = modl.NewDbMap(store.GetDB().DB, dialect)

	// initialize tables
	dbMap.AddTableWithName(User{}, "users")

	if err := dbMap.CreateTablesIfNotExists(); err != nil {
		log.Fatal().
			Err(err).
			Msg("Could not initialize database tables")
	}

	// store.GetDB().
	// 	Set("gorm:table_options", "CHARSET=utf8mb4").
	// 	AutoMigrate(
	// 		&User{},
	// 		&Repository{},
	// 		&Permission{},
	// 		&Organization{},
	// 		&Event{},
	// 	)
}
