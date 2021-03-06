package git

import (
	"strconv"
	"strings"
)

func packetWrite(str string) []byte {
	s := strconv.FormatInt(int64(len(str)+4), 16)

	if len(s)%4 != 0 {
		s = strings.Repeat("0", 4-len(s)%4) + s
	}

	return []byte(s + str)
}

func packetFlush() []byte {
	return []byte("0000")
}