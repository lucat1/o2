package models

import (
	"database/sql"
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

const selectIssues = `
SELECT i.*, u.name FROM issues i 
JOIN users u ON u.uuid = i.author
WHERE repository=? AND i.deleted_at IS NULL ORDER BY created_at DESC
`

const findIssueID = `
SELECT relative_id FROM issues WHERE repository=? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1
`

const findIssue = `
SELECT * FROM issues WHERE repository=? AND relative_id=? AND deleted_at IS NULL LIMIT 1 
`

// Issue is a struct holding the data for an issue inside a repository
type Issue struct {
	ID        int64      `json:"-"`
	CreatedAt time.Time  `db:"created_at" json:"opened"`
	UpdatedAt time.Time  `db:"updated_at" json:"-"`
	DeletedAt *time.Time `db:"deleted_at" json:"-"`

	Repository uuid.UUID `json:"-"`
	Author     uuid.UUID `json:"-"`
	RelativeID int64     `db:"relative_id" json:"id"`
	Title      string    `json:"title"`

	Name string `json:"name"`
}

// Insert inserts an issue into the database
func (issue *Issue) Insert() error {
	issue.CreatedAt = time.Now()
	issue.UpdatedAt = time.Now()

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
		store.GetDB().Rebind(updateIssue),
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

// SelectIssues returns a list of issues inside the requested repository
func SelectIssues(repository uuid.UUID) (issues []Issue, err error) {
	err = store.GetDB().Unsafe().Select(
		&issues,
		store.GetDB().Rebind(selectIssues),
		repository,
	)
	return
}

// GetIssueID returns the id for the latest issue created
func GetIssueID(repository uuid.UUID) (id int64, err error) {
	err = store.GetDB().Get(&id, findIssueID, repository)

	// if we have no errors it means this is the first issue created
	// on the repository. So we start at index 0 and it then gets incremented to 1
	// inside the limit, offset*limit, `NewIssueRenderer` method
	if err == sql.ErrNoRows {
		return 0, nil
	}

	return
}

// GetIssue returns an issue with the requested repository and id
func GetIssue(repository uuid.UUID, id int) (issue Issue, err error) {
	err = store.GetDB().Get(&issue, findIssue, repository, id)
	return
}
