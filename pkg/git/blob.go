package git

// Blob returns a blob object just for reading purpuses
func (b *Branch) Blob(name string) Blob {
	return Blob{
		Base: Base{
			Kind:   BlobKind,
			Branch: b,
		},
		Name: name,
	}
}

func (b Blob) Read() (string, error) {
	res, err := Command(b.Branch.repo.Path, "show", b.Branch.name+":"+b.Name)
	if err != nil {
		return "", err
	}

	return res.String(), nil
}
