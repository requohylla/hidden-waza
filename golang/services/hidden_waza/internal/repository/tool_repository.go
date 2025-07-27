// tool_repository.go: ツールテーブル用リポジトリ
package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"gorm.io/gorm"
)

type ToolRepository struct {
	db *gorm.DB
}

func NewToolRepository(db *gorm.DB) *ToolRepository {
	return &ToolRepository{db: db}
}

// ツール一覧取得
func (r *ToolRepository) FindAll() ([]domain.Tool, error) {
	var toolList []domain.Tool
	if err := r.db.Find(&toolList).Error; err != nil {
		return nil, err
	}
	return toolList, nil
}
