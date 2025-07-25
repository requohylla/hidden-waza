// os.go: osテーブル用ダミーデータ生成
package dummydata

import "github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"

func GenerateOSes(count int) []domain.OS {
	oses := make([]domain.OS, count)
	names := []string{
		"Windows", "macOS", "Linux", "Ubuntu", "CentOS",
		"Debian", "Fedora", "RedHat", "Android", "iOS",
	}
	for i := 0; i < count; i++ {
		name := ""
		if i < len(names) {
			name = names[i]
		} else {
			name = "DummyOS_" + string(rune(i+1))
		}
		oses[i] = domain.OS{
			ID:   uint(i + 1),
			Name: name,
		}
	}
	return oses
}
