// experience.go: experiencesテーブル用ダミーデータ生成
package dummydata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

func GenerateExperiences(count int, resumeCount int) []domain.Experience {
	rand.Seed(time.Now().UnixNano())
	experiences := make([]domain.Experience, count)
	companies := []string{"Google", "Amazon", "Meta", "Microsoft", "楽天", "サイバーエージェント", "LINE", "リクルート", "DeNA", "DummyCompany"}
	positions := []string{"Engineer", "Manager", "Designer", "PM", "QA", "SRE", "Data Scientist", "DummyPosition"}
	for i := 0; i < count; i++ {
		company := companies[i%len(companies)]
		position := positions[i%len(positions)]
		startYear := 2010 + rand.Intn(10)
		startMonth := 1 + rand.Intn(12)
		endYear := startYear + rand.Intn(3)
		endMonth := 1 + rand.Intn(12)
		experiences[i] = domain.Experience{
			ID:           uint(i + 1),
			ResumeID:     uint(rand.Intn(resumeCount) + 1),
			Company:      company,
			Position:     position,
			StartDate:    fmt.Sprintf("%04d-%02d-01", startYear, startMonth),
			EndDate:      fmt.Sprintf("%04d-%02d-01", endYear, endMonth),
			Description:  fmt.Sprintf("%sで%sとして従事。Dummy説明%d", company, position, i+1),
			PortfolioURL: fmt.Sprintf("https://portfolio.example.com/%d", i+1),
		}
	}
	return experiences
}
