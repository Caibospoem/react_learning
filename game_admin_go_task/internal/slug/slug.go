package slug

import (
	"regexp"
	"strings"
)

var nonAlphaNum = regexp.MustCompile(`[^a-z0-9]+`)

func Normalize(input string) string {
	s := strings.TrimSpace(strings.ToLower(input))
	s = strings.ReplaceAll(s, "_", " ")
	s = nonAlphaNum.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")

	if s == "" {
		return "untitled-project"
	}
	return s
}
