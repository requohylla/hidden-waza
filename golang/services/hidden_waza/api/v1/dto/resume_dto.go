package dto

// DTO（Data Transfer Object）は、API層とドメイン層（ビジネスロジック層）の間でデータを受け渡すための構造体です。
// このファイルのDTOは、主にHTTPリクエスト/レスポンスのJSONデータとGoのドメインモデル（domainパッケージの構造体）の変換に利用されます。
// 例えば、APIで受け取ったJSONをDTOにデコードし、DTOからドメインモデル（services/hidden_waza/internal/domain/resume.go等）へ変換してDB操作やビジネスロジックに渡します。
// また、DBから取得したドメインモデルをDTOに変換し、APIレスポンスとして返却します。
// 変換処理は主に [`resume_handler.go`](services/hidden_waza/internal/handler/resume_handler.go) で行われます。

// SkillDTOは、スキル情報をAPI層でやり取りするためのDTOです。
// ドメイン層の [`Skill`](services/hidden_waza/internal/domain/resume.go:11) と相互変換されます。
type SkillDTO struct {
	Type     string `json:"type"`
	MasterID uint   `json:"master_id"`
	Level    string `json:"level"`
	Years    int    `json:"years"`
}

// ExperienceDTOは、職務経歴情報をAPI層でやり取りするためのDTOです。
// ドメイン層の [`Experience`](services/hidden_waza/internal/domain/resume.go:12) と相互変換されます。
type ExperienceDTO struct {
	Company      string `json:"company"`
	Position     string `json:"position"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	Description  string `json:"description"`
	PortfolioURL string `json:"portfolio_url"`
}

// ResumeDTOは、職務経歴書全体をAPI層でやり取りするためのDTOです。
// ドメイン層の [`Resume`](services/hidden_waza/internal/domain/resume.go:6) と相互変換されます。
// 変換処理は [`resume_handler.go`](services/hidden_waza/internal/handler/resume_handler.go) のconvertSkillDTOs/convertExperienceDTOs等で実装されています。
type ResumeDTO struct {
	UserID      uint            `json:"user_id"`
	Title       string          `json:"title"`
	Summary     string          `json:"summary"`
	Skills      []SkillDTO      `json:"skills"`
	Experiences []ExperienceDTO `json:"experiences"`
}
