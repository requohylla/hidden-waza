// user_repository.go: ユーザー登録リポジトリ

package repository

import (
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) CreateUser(user *domain.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) FindByEmail(email domain.Email) (*domain.User, error) {
	var user domain.User
	if err := r.DB.Where("email = ?", string(email)).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
