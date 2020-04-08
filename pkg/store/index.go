package store

// Init initializes all the store components
// - logger
// - configuration
// - database(gorm)
func Init() {
	initLog()
	initConfig()
	initDB()
}
