// language_dto.go: 言語一覧取得用DTO
package dto

type LanguageDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
