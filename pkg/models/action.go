package models

import (
<<<<<<< Updated upstream
	"encoding/json"
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
const insertEvent = `
INSERT INTO events (
	created_at,
	updated_at,
	deleted_at,

	resource,
	time,
	kind,
	data
) VALUES (
	?, ?, ?,
	?, ?, ?, ?
)
`

const updateEvent = `
UPDATE events SET
	created_at=?,
	updated_at=?,
	deleted_at=?,

	resource=?,
	time=?,
	kind=?,
	data=?
WHERE id=?
`

>>>>>>> Stashed changes
// Event is the database model for a git event
type Event struct {
	Base

	Time         time.Time              `json:"time"`
	Kind         EventKind              `json:"kind"`
	ResourceUUID uuid.UUID              `gorm:"type:char(36);primary_index"`
	Data         map[string]interface{} `gorm:"-" json:"data"`
	RawData      []byte                 `gorm:"type:text" json:"-"`
}

// Insert inserts an event into the database
func (event *Event) Insert() error {
	event.generate()

	// query the db
	res, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertEvent),
		event.CreatedAt,
		event.UpdatedAt,
		event.DeletedAt,

		event.Resource,
		event.Time,
		event.Kind,
		event.Data,
	)
	if err != nil {
		return err
	}

<<<<<<< Updated upstream
	return scope.SetColumn("RawData", data)
=======
	event.ID, err = res.LastInsertId()
	return err
>>>>>>> Stashed changes
}

// AfterFind converts the RawData into Data
func (e *Event) AfterFind() (err error) {
	if len(e.RawData) != 0 {
		return json.Unmarshal(e.RawData, &e.Data)
	}
	return
}
