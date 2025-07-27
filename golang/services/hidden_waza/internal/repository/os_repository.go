// os_repository.go: OSテーブル用リポジトリ
package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"

	"gorm.io/gorm"
)

type OSRepository struct {
	db *gorm.DB
}

func NewOSRepository(db *gorm.DB) *OSRepository {
	return &OSRepository{db: db}
}

// OS一覧取得
func (r *OSRepository) FindAll() ([]domain.OS, error) {
	var osList []domain.OS
	if err := r.db.Find(&osList).Error; err != nil {
		return nil, err
	}
	return osList, nil
}
