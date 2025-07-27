// password.go: PasswordHash値オブジェクト

package domain

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type PasswordHash string

// 平文パスワードからハッシュを生成
func NewPasswordHash(plain string) (PasswordHash, error) {
	if len(plain) < 8 {
		return "", errors.New("password must be at least 8 characters")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return PasswordHash(hash), nil
}

// ハッシュと平文パスワードの照合
func (p PasswordHash) Verify(plain string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(p), []byte(plain))
	return err == nil
}
