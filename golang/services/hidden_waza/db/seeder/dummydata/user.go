// user.go: usersテーブル用ダミーデータ生成
package dummydata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

func GenerateUsers(n int) []domain.User {
	rand.Seed(time.Now().UnixNano())
	users := make([]domain.User, n)
	now := time.Now().Format("2006-01-02 15:04:05")
	for i := 0; i < n; i++ {
		plain := fmt.Sprintf("password%03d", i+1)
		hash, err := domain.NewPasswordHash(plain)
		if err != nil {
			panic(fmt.Sprintf("failed to hash password: %v", err))
		}
		users[i] = domain.User{
			Username:     fmt.Sprintf("dummy_user_%03d", i+1),
			Email:        domain.Email(fmt.Sprintf("user%03d%d@example.com", i+1, time.Now().UnixNano())),
			PasswordHash: hash,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
	}
	return users
}
