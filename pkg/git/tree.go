package git

import (
	"strconv"
	"strings"

	"github.com/rs/zerolog/log"
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
	ID   string
	Kind EntryKind

	Branch *Branch
	Mode   string
	Size   uint64
}

// Tree is a group of blobs and possibly other trees
type Tree struct {
	Entry
	Base

	Path     string
	Children []Entry
}

// Blob is a single file in git branch
type Blob struct {
	Entry
	Base

	Name string
}

// Tree returns a tree of files and folders
func (b *Branch) Tree(p string) (tree *Tree, err error) {
	// Fix path, must end with a / if it's not empty
	if len(p) > 1 && p[len(p)-1] != '/' {
		p += "/"
	}

	// TODO: use branch id(sha) instead of name could be better
	res, err := Command(b.repo.Path, "ls-tree", "-l", b.name, p)
	if err != nil {
		log.Error().
			Err(err).
			Str("stdout", res.String()).
			Str("branch", b.name).
			Str("repo", b.repo.Path).
			Msg("Could not get branch tree")
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
