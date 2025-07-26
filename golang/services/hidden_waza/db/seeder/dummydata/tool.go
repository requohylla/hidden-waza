// tool.go: toolsテーブル用ダミーデータ生成
package dummydata

import (
	"fmt"

	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

func GenerateTools(count int) []domain.Tool {
	tools := make([]domain.Tool, count)
	names := []string{
		"VSCode", "Docker", "Git", "Jenkins", "Slack",
		"Figma", "Postman", "Terraform", "Ansible", "Kubernetes",
	}
	for i := 0; i < count; i++ {
		name := ""
		if i < len(names) {
			name = names[i]
		} else {
			name = "DummyTool_" + fmt.Sprintf("%d", i+1)
		}
		tools[i] = domain.Tool{
			ID:   uint(i + 1),
			Name: name,
		}
	}
	return tools
}
