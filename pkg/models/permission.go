package models

// Permission is the database model for a permission to acess a resource
type Permission struct {
	For      User   `gorm:"primary_index" json:"for"`
	Resource string `gorm:"primary_index" json:"resource"`

	Owner     Repository `gorm:"foreignkey:OwnerName;association_foreignkey:CompuedName" json:"-"`
	OwnerName string     `gorm:"\primary_index" json:"owner"`
}
