// 職務経歴書DTO
package dto

type ResumeDTO struct {
	Name        string `json:"name"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Skills      string `json:"skills"`
	Experience  string `json:"experience"`
}
