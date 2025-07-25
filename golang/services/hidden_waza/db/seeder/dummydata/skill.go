// skill.go: skillsテーブル用ダミーデータ生成
package dummydata

import (
	"math/rand"
	"time"

	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

func GenerateSkills(count int, resumeCount, langCount, toolCount, osCount int) []domain.Skill {
	rand.Seed(time.Now().UnixNano())
	skills := make([]domain.Skill, count)
	types := []string{"language", "tool", "os"}
	levels := []string{"beginner", "intermediate", "advanced", "expert"}
	for i := 0; i < count; i++ {
		t := types[rand.Intn(len(types))]
		var masterID uint
		switch t {
		case "language":
			masterID = uint(rand.Intn(langCount) + 1)
		case "tool":
			masterID = uint(rand.Intn(toolCount) + 1)
		case "os":
			masterID = uint(rand.Intn(osCount) + 1)
		}
		skills[i] = domain.Skill{
			ID:       uint(i + 1),
			ResumeID: uint(rand.Intn(resumeCount) + 1),
			Type:     t,
			MasterID: masterID,
			Level:    levels[rand.Intn(len(levels))],
			Years:    rand.Intn(10) + 1,
		}
	}
	return skills
}
