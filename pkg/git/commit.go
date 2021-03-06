package git

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/lucat1/o2/pkg/models"
	"github.com/m1ome/randstr"
)

// DetailedCommit contains the commit info and also
type DetailedCommit struct {
	Commit

	Diff string `json:"diff"`
}

// Commit returns a single git commit with great detail
func (r Repository) Commit(sha string) (DetailedCommit, error) {
	sep := randstr.GetString(10) + "\n"
	buf, err := Command(
		r.Path,
		"show",
		sha,
		"--pretty=format:{\"commit\": \"%H\",\"abbrv\": \"%h\",\"tree\": \"%T\",\"abbrv_tree\": \"%t\",\"author\": {  \"name\": \"%aN\",  \"email\": \"%aE\",  \"date\": \"%aD\"},\"commiter\": {  \"name\": \"%cN\",  \"email\": \"%cE\",  \"date\": \"%cD\"}}"+sep+"%s"+sep+"%b"+sep,
	)
	if err != nil {
		return DetailedCommit{}, err
	}

	// parse the output
	parts := strings.Split(buf.String(), sep)
	if len(parts) != 4 {
		return DetailedCommit{}, errors.New("Corrupted git show output")
	}
	data, subject, body, diff := parts[0], parts[1], parts[2], parts[3]

	var out DetailedCommit
	if err = json.Unmarshal([]byte(data), &out); err != nil {
		return out, err
	}
	out.Subject = subject
	out.Body = body
	picture, err := models.GetPicture(out.Author.Name)
	if err != nil {
		return out, err
	}
	out.Author.Picture = picture

	// add git diff
	out.Diff = diff
	return out, nil
}
