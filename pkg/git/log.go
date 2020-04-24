package git

import (
	"encoding/json"
	"strconv"
)

// Commit holds the commit data
type Commit struct {
	Commit               string `json:"commit"`
	AbbreviatedCommit    string `json:"abbreviated_commit"`
	Tree                 string `json:"tree"`
	AbbreviatedTree      string `json:"abbreviated_tree"`
	Parent               string `json:"parent"`
	AbbreviatedParent    string `json:"abbreviated_parent"`
	Refs                 string `json:"refs"`
	Encoding             string `json:"encoding"`
	Subject              string `json:"subject"`
	SanitizedSubjectLine string `json:"sanitized_subject_line"`
	Body                 string `json:"body"`
	CommitNotes          string `json:"commit_notes"`
	VerificationFlag     string `json:"verification_flag"`
	Signer               string `json:"signer"`
	SignerKey            string `json:"signer_key"`
	Author               Author `json:"author"`
	Commiter             Author `json:"commiter"`
}

// Author is the author of a git commit
type Author struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Date  string `json:"date"`
}

// Commits lists the latest commits
func (branch Branch) Commits(offset, amount int) ([]Commit, error) {
	res := []Commit{}
	// git log --pretty=format:'{%n  "commit": "%H",%n  "abbreviated_commit": "%h",%n  "tree": "%T",%n  "abbreviated_tree": "%t",%n  "parent": "%P",%n  "abbreviated_parent": "%p",%n  "refs": "%D",%n  "encoding": "%e",%n  "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "verification_flag": "%G?",%n  "signer": "%GS",%n  "signer_key": "%GK",%n  "author": {%n    "name": "%aN",%n    "email": "%aE",%n    "date": "%aD"%n  },%n  "commiter": {%n    "name": "%cN",%n    "email": "%cE",%n    "date": "%cD"%n  }%n},'
	buf, err := Command(
		branch.repo.Path,
		"log",
		"--skip="+strconv.Itoa(offset),
		"-n "+strconv.Itoa(amount),
		"--pretty=format:{%n  \"commit\": \"%H\",%n  \"abbreviated_commit\": \"%h\",%n  \"tree\": \"%T\",%n  \"abbreviated_tree\": \"%t\",%n  \"parent\": \"%P\",%n  \"abbreviated_parent\": \"%p\",%n  \"refs\": \"%D\",%n  \"encoding\": \"%e\",%n  \"subject\": \"%s\",%n  \"sanitized_subject_line\": \"%f\",%n  \"body\": \"%b\",%n  \"commit_notes\": \"%N\",%n  \"verification_flag\": \"%G?\",%n  \"signer\": \"%GS\",%n  \"signer_key\": \"%GK\",%n  \"author\": {%n    \"name\": \"%aN\",%n    \"email\": \"%aE\",%n    \"date\": \"%aD\"%n  },%n  \"commiter\": {%n    \"name\": \"%cN\",%n    \"email\": \"%cE\",%n    \"date\": \"%cD\"%n  }%n},",
	)
	if err != nil {
		return res, err
	}

	// build the JSON string from the command output
	raw := buf.String()
	str := "[" + raw[:len(raw)-1] + "]"

	err = json.Unmarshal([]byte(str), &res)
	return res, err
}
