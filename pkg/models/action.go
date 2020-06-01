package models

import (
	"encoding/json"
	"time"

	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
)

// EventKind is the custom type for events kinds
type EventKind string

const (
	// CommitEvent is the kind for a commit event
	CommitEvent = EventKind("commit")
)

// Event is the database model for a git event
type Event struct {
	Base

	Time         time.Time              `json:"time"`
	Kind         EventKind              `json:"kind"`
	ResourceUUID uuid.UUID              `gorm:"type:char(36);primary_index"`
	Data         map[string]interface{} `gorm:"-" json:"data"`
	RawData      []byte                 `gorm:"type:text" json:"-"`
}

// BeforeSave converts the Data into RawData
func (e *Event) BeforeSave(scope *gorm.Scope) (err error) {
	data, err := json.Marshal(e.Data)
	if err != nil {
		return err
	}

	return scope.SetColumn("RawData", data)
}

// AfterFind converts the RawData into Data
func (e *Event) AfterFind() (err error) {
	if len(e.RawData) != 0 {
		return json.Unmarshal(e.RawData, &e.Data)
	}
	return
}
