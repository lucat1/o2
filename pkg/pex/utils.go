package pex

// from https://stackoverflow.com/a/10485970
func includes(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
