package git

import (
	"encoding/json"
	"strings"

	"github.com/lucat1/o2/pkg/models"
)

// DetailedCommit contains the commit info and also
type DetailedCommit struct {
	Commit

	Diff string `json:"diff"`
}

// Commit returns a single git commit with great detail
func (r Repository) Commit(sha string) (DetailedCommit, error) {
	buf, err := Command(
		r.Path,
		"show",
		sha,
		"--pretty=format:{\"commit\": \"%H\",\"abbrv\": \"%h\",\"tree\": \"%T\",\"abbrv_tree\": \"%t\",\"subject\": \"%s\",\"body\": \"%b\",\"author\": {  \"username\": \"%aN\",  \"email\": \"%aE\",  \"date\": \"%aD\"},\"commiter\": {  \"username\": \"%cN\",  \"email\": \"%cE\",  \"date\": \"%cD\"}}",
	)
	if err != nil {
		return DetailedCommit{}, err
	}

	// parse the output
	parts := strings.Split(buf.String(), "\n")
	data, diff, after := "", "", false
	for _, part := range parts {
		if len(part) > 9 && part[0:10] == "diff --git" {
			after = true
		}

		if after {
			diff += part + "\n"
		} else {
			data += part + "\n"
		}
	}

	var out DetailedCommit
	if err = json.Unmarshal([]byte(data), &out); err != nil {
		return out, nil
	}

	// generate profile pictures for authros/commiters
	out.Author.Picture = models.Picture(out.Author.Email)
	out.Commiter.Picture = models.Picture(out.Commiter.Email)

	// add git diff
	out.Diff = diff

	return out, nil
}
