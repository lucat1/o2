package git

import "strings"

// Blob returns a blob object just for reading purpuses
func (b Branch) Blob(name string) Blob {
	return Blob{
		Base: Base{
			Kind:   BlobKind,
			Branch: b,
		},
		Name: name,
	}
}

func (b *Blob) Read() (string, error) {
	path := b.Branch.Name + ":" + strings.Replace(b.Name, " ", "\\ ", -1)
	res, err := Command(b.Branch.repo.Path, "show", path)
	if err != nil {
		return "", err
	}

	b.Size = uint64(res.Len())
	return res.String(), nil
}
