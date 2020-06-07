package models

import (
	"time"

	"github.com/jmoiron/sqlx/types"
	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const (
	// CommitEvent is the kind for a commit event
	CommitEvent = Type("commit")
)

const insertEvent = `
INSERT INTO events (
	created_at,
	updated_at,
	deleted_at,

	resource,
	time,
	type,
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
	type=?,
	data=?
WHERE id=?
`

const selectVisibleEvents = `
SELECT * FROM events e 
JOIN permissions p ON e.resource = p.resource
JOIN repositories r ON e.resource = r.uuid
WHERE (p.beneficiary = ? OR p.beneficiary = ?) AND p.scope = "repo:pull"
LIMIT ? OFFSET ?
`

// Event is the database model for a git event
type Event struct {
	Model

	Resource uuid.UUID `json:"-"`
	// inherit from repository
	OwnerName string `db:"owner_name" json:"owner"`
	Name      string `json:"name"`

	Time time.Time      `json:"time"`
	Type Type           `json:"type"`
	Data types.JSONText `json:"data"`
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
		event.Type,
		event.Data,
	)
	if err != nil {
		return err
	}

	event.ID, err = res.LastInsertId()
	return err
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
		event.Type,
		event.Data,

		// where
		event.ID,
	)

	return err
}

// SelectVisileEvents returns a list of visible events for the given user
// limited and offsetted eventually
func SelectVisileEvents(beneficiary uuid.UUID, limit, offset int) (events []Event, err error) {
	err = store.GetDB().Unsafe().Select(
		&events,
		store.GetDB().Rebind(selectVisibleEvents),
		beneficiary, uuid.Nil, limit, offset*limit,
	)
	return
}
