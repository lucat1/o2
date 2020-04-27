package git

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/lucat1/o2/pkg/models"
)

type internalCommit struct {
	Commit               string         `json:"commit"`
	AbbreviatedCommit    string         `json:"abbreviated_commit"`
	Tree                 string         `json:"tree"`
	AbbreviatedTree      string         `json:"abbreviated_tree"`
	Parent               string         `json:"parent"`
	AbbreviatedParent    string         `json:"abbreviated_parent"`
	Refs                 string         `json:"refs"`
	Encoding             string         `json:"encoding"`
	Subject              string         `json:"subject"`
	SanitizedSubjectLine string         `json:"sanitized_subject_line"`
	Body                 string         `json:"body"`
	CommitNotes          string         `json:"commit_notes"`
	VerificationFlag     string         `json:"verification_flag"`
	Signer               string         `json:"signer"`
	SignerKey            string         `json:"signer_key"`
	Author               internalAuthor `json:"author"`
	Commiter             internalAuthor `json:"commiter"`
}

// GitAuthor is the author of a git commit
type internalAuthor struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Date  string `json:"date"`
}

// Commit holds the commit data
type Commit struct {
	Commit            string       `json:"commit"`
	AbbreviatedCommit string       `json:"abbrv"`
	Tree              string       `json:"tree"`
	AbbreviatedTree   string       `json:"abbrv_tree"`
	Subject           string       `json:"subject"`
	Author            CommitAuthor `json:"author"`
	Commiter          CommitAuthor `json:"commiter"`
}

// CommitAuthor is the generated author of a commit with custom values
type CommitAuthor struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Picture  string `json:"picture"`
	Date     string `json:"date"`
}

// Commits is a struct holding the output of the log command with
// some computed data(pagination mainly)
type Commits struct {
	Index   int      `json:"index"`
	Next    bool     `json:"next"`
	Prev    bool     `json:"perv"`
	Commits []Commit `json:"commits"`
}

// Commits lists the latest commits
func (branch Branch) Commits(offset, amount int) (Commits, error) {
	res := Commits{
		Index:   offset,
		Prev:    offset != 0,
		Commits: []Commit{},
	}
	// git log --pretty=format:'{%n  "commit": "%H",%n  "abbreviated_commit": "%h",%n  "tree": "%T",%n  "abbreviated_tree": "%t",%n  "parent": "%P",%n  "abbreviated_parent": "%p",%n  "refs": "%D",%n  "encoding": "%e",%n  "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "verification_flag": "%G?",%n  "signer": "%GS",%n  "signer_key": "%GK",%n  "author": {%n    "name": "%aN",%n    "email": "%aE",%n    "date": "%aD"%n  },%n  "commiter": {%n    "name": "%cN",%n    "email": "%cE",%n    "date": "%cD"%n  }%n},'
	buf, err := Command(
		branch.repo.Path,
		"log",
		branch.Name,
		"--skip="+strconv.Itoa(offset*amount),
		"-n "+strconv.Itoa(amount),
		"--pretty=format:{\"commit\": \"%H\",\"abbreviated_commit\": \"%h\",\"tree\": \"%T\",\"abbreviated_tree\": \"%t\",\"parent\": \"%P\",\"abbreviated_parent\": \"%p\",\"refs\": \"%D\",\"encoding\": \"%e\",\"subject\": \"%s\",\"sanitized_subject_line\": \"%f\",\"commit_notes\": \"%N\",\"verification_flag\": \"%G?\",\"signer\": \"%GS\",\"signer_key\": \"%GK\",\"author\": {  \"name\": \"%aN\",  \"email\": \"%aE\",  \"date\": \"%aD\"},\"commiter\": {  \"name\": \"%cN\",  \"email\": \"%cE\",  \"date\": \"%cD\"}},",
	)
	if err != nil {
		return res, err
	}

	if buf.Len() == 0 {
		return res, errors.New("empty commit log")
	}

	// build the JSON string from the command output
	raw := buf.String()
	str := "[" + raw[:len(raw)-1] + "]"

	var out []internalCommit
	err = json.Unmarshal([]byte(str), &out)

	for i, ic := range out {
		res.Commits = append(res.Commits, Commit{
			Commit:            ic.Commit,
			AbbreviatedCommit: ic.AbbreviatedCommit,
			Tree:              ic.Tree,
			AbbreviatedTree:   ic.AbbreviatedTree,
			Subject:           ic.Subject,
			Author: CommitAuthor{
				Username: ic.Author.Name,
				Email:    ic.Author.Email,
				Picture:  models.Picture(ic.Author.Email),
				Date:     ic.Author.Date,
			},
			Commiter: CommitAuthor{
				Username: ic.Commiter.Name,
				Email:    ic.Commiter.Email,
				Picture:  models.Picture(ic.Commiter.Email),
				Date:     ic.Commiter.Date,
			},
		})

		// if we have a parent it means that we have more commits
		// in the history to show, so we can enable the next page button
		if i == amount-1 && ic.Parent != "" {
			res.Next = true
		}
	}

	return res, err
}
