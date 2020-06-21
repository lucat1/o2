package models

import (
	"time"

	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const insertIssue = `
INSERT INTO issues (
	created_at,
	updated_at,
	deleted_at,

	repository,
	author,
	relative_id,
	title
) VALUES (
	?, ?, ?,
	?, ?, ?, ?
)
`

const updateIssue = `
UPDATE issues SET (
	created_at=?,
	updated_at=?,
	deleted_at=?,

	repository=?,
	author=?,
	relative_id=?,
	title=?
WHERE id=?
`

// Issue is a struct holding the data for an issue inside a repository
type Issue struct {
	Model

	Repository uuid.UUID `json:"repository"`
	Author     uuid.UUID `json:"author"`
	RelativeID int64     `json:"id"`
	Title      string    `json:"title"`
}

// Insert inserts an issue into the database
func (issue *Issue) Insert() error {
	issue.generate()

	// query the db
	res, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertIssue),
		issue.CreatedAt,
		issue.UpdatedAt,
		issue.DeletedAt,

		issue.Repository,
		issue.Author,
		issue.RelativeID,
		issue.Title,
	)
	if err != nil {
		return err
	}

	issue.ID, err = res.LastInsertId()
	return err
}

// Update updates an issue struct in the database
func (issue Issue) Update() error {
	// update updated_at time stamp
	issue.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateEvent),
		issue.CreatedAt,
		issue.UpdatedAt,
		issue.DeletedAt,

		issue.Repository,
		issue.Author,
		issue.RelativeID,
		issue.Title,

		// where
		issue.ID,
	)

	return err
}
