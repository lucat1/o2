package git

import (
	"net/http"
	"strings"
)

func getServiceType(r *http.Request) string {
	serviceType := r.FormValue("service")

	if !strings.HasPrefix(serviceType, "git-") {
		return ""
	}

	return strings.Replace(serviceType, "git-", "", 1)
}
