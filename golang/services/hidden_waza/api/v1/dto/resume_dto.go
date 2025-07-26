package dto

type SkillDTO struct {
	Type     string `json:"type"`
	MasterID uint   `json:"master_id"`
	Level    string `json:"level"`
	Years    int    `json:"years"`
}

type ExperienceDTO struct {
	Company      string `json:"company"`
	Position     string `json:"position"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	Description  string `json:"description"`
	PortfolioURL string `json:"portfolio_url"`
}

type ResumeDTO struct {
	UserID      uint            `json:"user_id"`
	Title       string          `json:"title"`
	Summary     string          `json:"summary"`
	Skills      []SkillDTO      `json:"skills"`
	Experiences []ExperienceDTO `json:"experiences"`
}
