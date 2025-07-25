// 職務経歴書モデル
package domain

import "time"

type Resume struct {
	ID          uint         `json:"id"`
	UserID      uint         `json:"user_id"`
	Title       string       `json:"title"`
	Summary     string       `json:"summary"`
	Skills      []Skill      `json:"skills"`
	Experiences []Experience `json:"experiences"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}
