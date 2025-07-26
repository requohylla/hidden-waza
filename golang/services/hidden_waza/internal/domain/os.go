// os.go: osテーブル用ドメインモデル
package domain

type OS struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (OS) TableName() string {
	return "os"
}
