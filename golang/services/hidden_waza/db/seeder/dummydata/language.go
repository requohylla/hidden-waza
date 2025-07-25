// language.go: languagesテーブル用ダミーデータ生成
package dummydata

import "github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"

func GenerateLanguages(count int) []domain.Language {
	languages := make([]domain.Language, count)
	names := []string{"Go", "Python", "JavaScript", "Java", "C#", "Ruby", "PHP", "TypeScript", "Swift", "Kotlin"}
	for i := 0; i < count; i++ {
		name := ""
		if i < len(names) {
			name = names[i]
		} else {
			name = "DummyLanguage_" + string(rune(i+1))
		}
		languages[i] = domain.Language{
			ID:   uint(i + 1),
			Name: name,
		}
	}
	return languages
}
