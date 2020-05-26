package datas

import (
	"net/http"
	"path"

	"github.com/lucat1/o2/pkg/data"
	"github.com/lucat1/o2/pkg/git"
	"github.com/lucat1/quercia"
)

// BlobData composes the data for the blob page
func BlobData(blob git.Blob, data string) data.Composer {
	return func(r *http.Request) quercia.Props {
		ext := path.Ext(blob.Name)
		if len(ext) > 1 {
			ext = ext[1:] // trim trailing .
		}

		return quercia.Props{
			"blob": blob,
			"data": data,
			"ext":  ext,
		}
	}
}
