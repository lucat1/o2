package git

import (
	"encoding/json"
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

// Commits lists the latest commits
func (branch Branch) Commits(offset, amount int) ([]Commit, error) {
	res := []Commit{}
	// git log --pretty=format:'{%n  "commit": "%H",%n  "abbreviated_commit": "%h",%n  "tree": "%T",%n  "abbreviated_tree": "%t",%n  "parent": "%P",%n  "abbreviated_parent": "%p",%n  "refs": "%D",%n  "encoding": "%e",%n  "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "verification_flag": "%G?",%n  "signer": "%GS",%n  "signer_key": "%GK",%n  "author": {%n    "name": "%aN",%n    "email": "%aE",%n    "date": "%aD"%n  },%n  "commiter": {%n    "name": "%cN",%n    "email": "%cE",%n    "date": "%cD"%n  }%n},'
	buf, err := Command(
		branch.repo.Path,
		"log",
		branch.Name,
		"--skip="+strconv.Itoa(offset),
		"-n "+strconv.Itoa(amount),
		"--pretty=format:{\"commit\": \"%H\",\"abbreviated_commit\": \"%h\",\"tree\": \"%T\",\"abbreviated_tree\": \"%t\",\"parent\": \"%P\",\"abbreviated_parent\": \"%p\",\"refs\": \"%D\",\"encoding\": \"%e\",\"subject\": \"%s\",\"sanitized_subject_line\": \"%f\",\"commit_notes\": \"%N\",\"verification_flag\": \"%G?\",\"signer\": \"%GS\",\"signer_key\": \"%GK\",\"author\": {  \"name\": \"%aN\",  \"email\": \"%aE\",  \"date\": \"%aD\"},\"commiter\": {  \"name\": \"%cN\",  \"email\": \"%cE\",  \"date\": \"%cD\"}},",
	)
	if err != nil {
		return res, err
	}

	// build the JSON string from the command output
	raw := buf.String()
	str := "[" + raw[:len(raw)-1] + "]"

	var out []internalCommit
	err = json.Unmarshal([]byte(str), &out)

	for _, ic := range out {
		res = append(res, Commit{
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
	}

	return res, err
}
