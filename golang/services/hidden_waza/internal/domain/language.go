// language.go: languagesテーブル用ドメインモデル
package domain

type Language struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (Language) TableName() string {
	return "languages"
}
