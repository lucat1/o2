package store

// Init initializes all the store components
// - logger
// - configuration
// - database(gorm)
func Init() {
	initConfig()
	initLog()
	initDB()
	initHooks()
}
