package models

// Repository is the database model for a git repository
type Repository struct {
	Owner User `gorm:"unique_index" json:"owner"`

	Name        string `gorm:"unique_index" json:"name"`
	Description string `gorm:"type:varchar(250)" json:"description"`
}

// ExistsRepository checks for the existance of the given repository with the given owner
func ExistsRepository(owner string, reponame string) bool {
	return false
}
