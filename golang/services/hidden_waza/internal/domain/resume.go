// 職務経歴書モデル
package domain

type Resume struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Skills      string `json:"skills"`
	Experience  string `json:"experience"`
}
