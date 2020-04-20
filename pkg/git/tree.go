package git

import (
	"strconv"
	"strings"
)

// EntryKind can be either blob or tree
type EntryKind uint8

const (
	// TreeKind is the tree entry kind
	TreeKind EntryKind = 0
	// BlobKind is the blob entry kind
	BlobKind EntryKind = 1
)

// Entry is a fake type to group both Trees and Blobs
type Entry interface{}

// Base is a struct wich holds all shared fields between trees and blobs
type Base struct {
	ID   string    `json:"-"`
	Kind EntryKind `json:"kind"`

	Branch *Branch `json:"-"`
	Mode   string  `json:"mode"`
	Size   uint64  `json:"size"`
}

// Tree is a group of blobs and possibly other trees
type Tree struct {
	Entry `json:"-"`
	Base

	Path     string  `json:"path"`
	Children []Entry `json:"children"`
}

// Blob is a single file in git branch
type Blob struct {
	Entry `json:"-"`
	Base

	Name string `json:"name"`
}

// Tree returns a tree of files and folders
func (b *Branch) Tree(p string) (tree *Tree, err error) {
	// Fix path, must end with a / if it's not empty
	if len(p) > 1 && p[len(p)-1] != '/' {
		p += "/"
	}

	// TODO: use branch id(sha) instead of name could be better
	res, err := Command(b.repo.Path, "ls-tree", "-l", b.Name, p)
	if err != nil {
		return nil, err
	}

	returnValue := Tree{
		Base: Base{
			Kind:   TreeKind,
			Branch: b,
		},
		Path: p,
	}
	lines := strings.Split(res.String(), "\n")
	for i := 0; i < len(lines); i++ {
		// <mode> <blob|tree> <sha> <size> <name>
		parts := strings.Fields(strings.TrimSpace(lines[i]))
		if len(parts) < 5 {
			continue
		}
		mode := parts[0]
		_kind := parts[1]
		sha := parts[2]
		size, _ := strconv.ParseUint(parts[3], 10, 64)
		name := parts[4]

		// The real kind
		kind := BlobKind
		if _kind == "tree" {
			//tree
			kind = TreeKind
			returnValue.Children = append(returnValue.Children, Tree{
				Base: Base{
					Kind:   kind,
					ID:     sha,
					Branch: b,
					Mode:   mode,
					Size:   size,
				},
				Path: name,
			})
			continue
		}

		// blob
		returnValue.Children = append(returnValue.Children, Blob{
			Base: Base{
				Kind:   kind,
				ID:     sha,
				Branch: b,
				Mode:   mode,
				Size:   size,
			},
			Name: name,
		})
	}

	return &returnValue, nil
}
