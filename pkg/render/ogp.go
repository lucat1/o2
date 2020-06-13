package render

import (
	"net/http"
	"strings"
)

// SEO optimization and social media metadata provider
// see: https://ogp.me/

// OGPTag returns a og: prefixed meta tag
func OGPTag(property string, value string) string {
	return `<meta property="og:` + property + `" content="` + value + `">`
}

// ProfileTag returns a profile: prefixed meta tag (Open Graph Protocol)
func ProfileTag(property string, value string) string {
	return `<meta property="profile:` + property + `" content="` + value + `">`
}

// TwitterTag returns a twitter: prefixed meta tag
func TwitterTag(property string, value string) string {
	return `<meta name="twitter:` + property + `" content="` + value + `">`
}

// SEO returns a skeleton HTML containing only a head tag with SEO metadata
func SEO(w http.ResponseWriter, r *http.Request, tags ...string) {
	tags = append([]string{
		OGPTag("url", r.URL.Scheme+"://"+r.Host+r.URL.Path),
		OGPTag("locale", "en"),
		OGPTag("site_name", "o2"),
		OGPTag("type", "website"),
		// TODO: move the logo somewhere static
		// OGPTag("image", ""),
		TwitterTag("card", "summary"),
	}, tags...)

	w.Write([]byte(`<!DOCTYPE html><html lang="en"><head>` + strings.Join(tags, "") + `</head></html>`))
}
