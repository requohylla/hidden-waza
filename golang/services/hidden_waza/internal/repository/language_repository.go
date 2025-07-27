// language_repository.go: 言語テーブル用リポジトリ
package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"gorm.io/gorm"
)

type LanguageRepository struct {
	db *gorm.DB
}

func NewLanguageRepository(db *gorm.DB) *LanguageRepository {
	return &LanguageRepository{db: db}
}

// 言語一覧取得
func (r *LanguageRepository) FindAll() ([]domain.Language, error) {
	var langList []domain.Language
	if err := r.db.Find(&langList).Error; err != nil {
		return nil, err
	}
	return langList, nil
}
