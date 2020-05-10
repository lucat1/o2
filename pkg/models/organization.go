package models

// Organization is the database model for an org
type Organization struct {
	Base

	Name        string `gorm:"type:varchar(32);unique_index" json:"name"`
	Description string `gorm:"type:varchar(250)" json:"description"`
	Location    string `gorm:"type:varchar(100)" json:"location"`

	Users        []User       `gorm:"many2many:user_orgs;"`
	Repositories []Repository `gorm:"foreignkey:OwnerName;association_foreignkey:Username" json:"repositories"`
}
