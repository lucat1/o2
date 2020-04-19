package git

// Branch is a object representing a git branch,
// tough it doesn't guarantee that it exists
type Branch struct {
	repo *Repository
	name string
}

// Branch returns the theoretical branch object
func (r *Repository) Branch(branch string) *Branch {
	return &Branch{
		repo: r,
		name: branch,
	}
}

// Exists returns the existanche of a git branch
func (b *Branch) Exists() bool {
	_, err := Command(b.repo.Path, "rev-parse", "--verify", b.name)
	return err == nil
}

// ID returns the branch sha
func (b *Branch) ID() (string, error) {
	id, err := Command(b.repo.Path, "rev-parse", "--verify", b.name)
	if err != nil {
		return "", err
	}

	return id.String(), nil
}
