package git

import (
	"errors"
	"strings"
)

// RefType is the type of a Ref
type RefType string

const (
	// BranchType is used to idetify branch refs
	BranchType RefType = "branch"

	// TagType is used to idetify tag refs
	TagType RefType = "tag"
)

// Ref is a struct which holds the git ref basic data
type Ref struct {
	Kind RefType `json:"kind"`
	Name string  `json:"name"`
	SHA  string  `json:"sha"`
}

// Refs returns all the brances and tags available in the repo (refs)
func (r *Repository) Refs() ([]Ref, error) {
	refs := []Ref{}
	res, err := Command(r.Path, "show-ref")
	if err != nil {
		return refs, err
	}

	lines := strings.Split(res.String(), "\n")
	for _, line := range lines {
		if line == "" {
			continue
		}

		parts := strings.Split(line, " ")
		kind, name := RefType(""), ""

		if parts[1][:6] == "refs/t" {
			kind = TagType
			name = parts[1][10:]
		}

		if parts[1][:6] == "refs/h" {
			kind = BranchType
			name = parts[1][11:]
		}

		if len(kind) == 0 {
			return refs, errors.New("Invalid ref type")
		}

		refs = append(refs, Ref{
			Kind: kind,
			Name: name,
			SHA:  parts[0],
		})
	}

	return refs, nil
}
