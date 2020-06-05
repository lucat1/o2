package models

import (
	"errors"
	"time"

	"github.com/jmoiron/sqlx/types"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

// EventKind is the custom type for events kinds
type EventKind string

const (
	// CommitEvent is the kind for a commit event
	CommitEvent = EventKind("commit")
)

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
	?, ?, ?, ?,
	?, ?, ?, ?
) RETURNING id
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

// Event is the database model for a git event
type Event struct {
	Model

	Resource uuid.UUID      `json:"resource"`
	Time     time.Time      `json:"time"`
	Kind     EventKind      `json:"kind"`
	Data     types.JSONText `gorm:"-" json:"data"`
}

// Insert inserts an event into the database
func (event *Event) Insert() error {
	event.generate()

	// query the db
	rows, err := store.GetDB().Query(
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
	if !rows.Next() {
		return errors.New("Insert didn't return any row")
	}

	return rows.Scan(&event.ID)
}

// Update updates an event struct in the database
func (event Event) Update() error {
	// update updated_at time stamp
	event.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateEvent),
		event.CreatedAt,
		event.UpdatedAt,
		event.DeletedAt,

		event.Resource,
		event.Time,
		event.Kind,
		event.Data,

		// where
		event.ID,
	)

	return err
}
