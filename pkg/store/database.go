package store

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/lucat1/o2/pkg/log"
	sqldblogger "github.com/simukti/sqldb-logger"
	"github.com/simukti/sqldb-logger/logadapter/zerologadapter"

	// mysql driver for sql(x)
	_ "github.com/go-sql-driver/mysql"

	// sqlite driver for sql(x)
	_ "github.com/mattn/go-sqlite3"

	// postgres driver for sql(x)
	_ "github.com/lib/pq"
)

var database *sqlx.DB

// InitDatabase initializes the database connection
func InitDatabase() {
	dialect := config.Section("database").Key("dialect").String()
	uri := config.Section("database").Key("uri").String()
	log.Debug().
		Str("dialect", dialect).
		Str("uri", uri).
		Msg("Opening to database")

	// connection URI format: user:password@(localhost)/dbname?charset=utf8&parseTime=True&loc=Local
	db, err := sql.Open(dialect, uri)
	if err != nil {
		log.Fatal().Err(err).Msg("Could not parse connection URI")
	}
	if err = db.Ping(); err != nil {
		log.Fatal().Err(err).Msg("Could not connect to database")
	}

	loggerAdapter := zerologadapter.New(log.Logger)
	db = sqldblogger.OpenDriver(
		uri, db.Driver(), loggerAdapter,
		sqldblogger.WithQueryerLevel(sqldblogger.LevelDebug),
		sqldblogger.WithPreparerLevel(sqldblogger.LevelDebug),
		sqldblogger.WithExecerLevel(sqldblogger.LevelDebug),
	)

	log.Info().Msg("Successfully connected to the database")
	database = sqlx.NewDb(db, dialect)
}

// GetDB returns the current database instance
func GetDB() *sqlx.DB {
	return database
}

// CloseDB closes the connection to the database
func CloseDB() error {
	return database.Close()
}
