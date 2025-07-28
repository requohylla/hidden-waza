/*
resume_repository.go

このファイルは職務経歴書（Resume）ドメインモデルのDB操作を担当するリポジトリ層です。
主な役割は以下の通り：
- ドメイン層（[`Resume`](services/hidden_waza/internal/domain/resume.go)）の永続化・取得・検索などのDB操作を抽象化
- 上位層（ハンドラやサービス層）はDBの具体的な実装（ORMやSQL）を意識せずに利用可能
- DBアクセスにはGORMを利用し、テーブル構造やSQL文を隠蔽
- API層やDTO層とは直接やり取りせず、ドメインモデルのみを扱うことで責務分離を実現

この設計により、DB変更や永続化戦略の変更時も上位層への影響を最小限に抑えられます。
*/
package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"gorm.io/gorm"
)

// ResumeRepositoryは、ResumeドメインモデルのDB操作を提供する構造体です。
type ResumeRepository struct {
	db *gorm.DB
}

// NewResumeRepositoryは、DB接続情報を受け取りリポジトリを生成します。
func NewResumeRepository(db *gorm.DB) *ResumeRepository {
	return &ResumeRepository{db: db}
}

// Createは、ResumeドメインモデルをDBに新規登録します。
func (r *ResumeRepository) Create(resume *domain.Resume) error {
	return r.db.Create(resume).Error
}

// GetAllは、全てのResumeレコードを取得します。
func (r *ResumeRepository) GetAll() ([]domain.Resume, error) {
	var resumes []domain.Resume
	err := r.db.Find(&resumes).Error
	if err != nil {
		return nil, err
	}
	r.AttachSkills(resumes)
	return resumes, nil
}

// GetByUserIDは、指定ユーザーIDのResumeレコードを全件取得します。
func (r *ResumeRepository) GetByUserID(userID uint) ([]domain.Resume, error) {
	var resumes []domain.Resume
	err := r.db.Where("user_id = ?", userID).Find(&resumes).Error
	if err != nil {
		return nil, err
	}
	r.AttachSkills(resumes)
	return resumes, nil
}

// GetByIDは、主キーIDでResumeレコードを1件取得します。
func (r *ResumeRepository) GetByID(id uint) (*domain.Resume, error) {
	var resume domain.Resume
	err := r.db.First(&resume, id).Error
	if err != nil {
		return nil, err
	}
	// skillsを取得してセット
	var skills []domain.Skill
	r.db.Where("resume_id = ?", resume.ID).Find(&skills)
	resume.Skills = skills
	return &resume, nil
}

// 共通: skills取得処理
func (r *ResumeRepository) AttachSkills(resumes []domain.Resume) {
	for i := range resumes {
		var skills []domain.Skill
		r.db.Where("resume_id = ?", resumes[i].ID).Find(&skills)
		resumes[i].Skills = skills
	}
}
