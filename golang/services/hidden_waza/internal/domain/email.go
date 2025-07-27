// email.go: Email値オブジェクト

package domain

import "strings"

type Email string

func (e Email) IsValid() bool {
	return len(e) > 3 && strings.Contains(string(e), "@")
}
