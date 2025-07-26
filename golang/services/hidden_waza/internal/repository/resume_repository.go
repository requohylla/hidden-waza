// MariaDB用職務経歴書リポジトリ
package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"gorm.io/gorm"
)

type ResumeRepository struct {
	db *gorm.DB
}

func NewResumeRepository(db *gorm.DB) *ResumeRepository {
	return &ResumeRepository{db: db}
}

func (r *ResumeRepository) Create(resume *domain.Resume) error {
	return r.db.Create(resume).Error
}

func (r *ResumeRepository) GetAll() ([]domain.Resume, error) {
	var resumes []domain.Resume
	err := r.db.Find(&resumes).Error
	return resumes, err
}

func (r *ResumeRepository) GetByUserID(userID uint) ([]domain.Resume, error) {
	var resumes []domain.Resume
	err := r.db.Where("user_id = ?", userID).Find(&resumes).Error
	return resumes, err
}

func (r *ResumeRepository) GetByID(id uint) (*domain.Resume, error) {
	var resume domain.Resume
	err := r.db.First(&resume, id).Error
	return &resume, err
}
