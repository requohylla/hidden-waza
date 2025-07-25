// resume.go: resumesテーブル用ダミーデータ生成

package dummydata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

func GenerateResumes(n int) []domain.Resume {
	rand.Seed(time.Now().UnixNano())
	resumes := make([]domain.Resume, n)
	t, _ := time.Parse(time.RFC3339, "2025-01-01T00:00:00Z")
	for i := 0; i < n; i++ {
		resumes[i] = domain.Resume{
			Title:     fmt.Sprintf("ダミーレジュメ%03d", i+1),
			UserID:    uint(rand.Intn(100) + 1),
			CreatedAt: t,
			UpdatedAt: t,
		}
	}
	return resumes
}
