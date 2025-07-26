// tool.go: toolsテーブル用ドメインモデル
package domain

type Tool struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (Tool) TableName() string {
	return "tools"
}
