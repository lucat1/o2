package models

// Organization is the database model for an org
type Organization struct {
	Base

	Name        string `gorm:"type:varchar(32);primary_key" json:"name"`
	Description string `gorm:"type:varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci" json:"description"`
	Location    string `gorm:"type:varchar(100)" json:"location"`

	Users        []User       `gorm:"many2many:user_orgs;" json:"users"`
	Repositories []Repository `gorm:"polymorphic:Owner" json:"repositories"`
}
