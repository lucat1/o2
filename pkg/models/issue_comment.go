package models

import (
	"time"

	"github.com/lucat1/o2/pkg/store"
	uuid "github.com/satori/go.uuid"
)

const insertIssueComment = `
INSERT INTO issue_comments (
	created_at,
	updated_at,
	deleted_at,

	issue,
	author,
	body
) VALUES (
	?, ?, ?,
	?, ?, ?
)
`

const updateIssueComment = `
UPDATE issue_comments SET (
	created_at=?,
	updated_at=?,
	deleted_at=?,

	issue=?,
	author=?,
	body=?
WHERE id=?
`

const selectIssueComments = `
SELECT i.*, u.uuid, u.picture, u.name FROM issue_comments i
JOIN users u ON u.uuid = i.author
WHERE issue=? AND i.deleted_at IS NULL
`

type IssueComment struct {
	ID        int64      `json:"-"`
	CreatedAt time.Time  `db:"created_at" json:"commented"`
	UpdatedAt time.Time  `db:"updated_at" json:"edited"`
	DeletedAt *time.Time `db:"deleted_at" json:"-"`

	Issue  int64     `json:"-"`
	Author uuid.UUID `json:"-"`
	Body   string    `json:"body"`

	Picture string `json:"picture"`
	Name    string `json:"name"`
}

func (issueComment *IssueComment) Insert() error {
	issueComment.CreatedAt = time.Now()
	issueComment.UpdatedAt = time.Now()

	// query the db
	res, err := store.GetDB().Exec(
		store.GetDB().Rebind(insertIssueComment),
		issueComment.CreatedAt,
		issueComment.UpdatedAt,
		issueComment.DeletedAt,

		issueComment.Issue,
		issueComment.Author,
		issueComment.Body,
	)
	if err != nil {
		return err
	}

	issueComment.ID, err = res.LastInsertId()
	return err
}

func (issueComment IssueComment) Update() error {
	// update updated_at time stamp
	issueComment.UpdatedAt = time.Now()

	// query the db
	_, err := store.GetDB().Exec(
		store.GetDB().Rebind(updateIssueComment),
		issueComment.CreatedAt,
		issueComment.UpdatedAt,
		issueComment.DeletedAt,

		issueComment.Issue,
		issueComment.Author,
		issueComment.Body,

		// where
		issueComment.ID,
	)

	return err
}

// SelectIssueComments returns a list of issue comments inside the requested issue
func SelectIssueComments(issue int) (comments []IssueComment, err error) {
	err = store.GetDB().Unsafe().Select(
		&comments,
		store.GetDB().Rebind(selectIssueComments),
		issue,
	)
	return
}
