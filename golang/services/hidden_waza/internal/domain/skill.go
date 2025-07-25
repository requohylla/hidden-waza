package domain

type Skill struct {
	ID       uint   `json:"id"`
	ResumeID uint   `json:"resume_id"`
	Type     string `json:"type"`      // "language", "tool", "os"
	MasterID uint   `json:"master_id"` // languages/tools/osのid
	Level    string `json:"level"`
	Years    int    `json:"years"`
}
