// experience.go: experiencesテーブル用ドメインモデル
package domain

type Experience struct {
	ID           uint   `json:"id"`
	ResumeID     uint   `json:"resume_id"`
	Company      string `json:"company"`
	Position     string `json:"position"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	Description  string `json:"description"`
	PortfolioURL string `json:"portfolio_url"`
}

func (e Experience) IsValid() bool {
	if e.Company == "" || e.StartDate == "" {
		return false
	}
	return true
}

func (Experience) TableName() string {
	return "experiences"
}
