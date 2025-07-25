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
	for i := 0; i < n; i++ {
		users[i] = domain.User{
			Username:     fmt.Sprintf("dummy_user_%03d", i+1),
			Email:        fmt.Sprintf("user%03d@example.com", i+1),
			PasswordHash: "dummyhash",
			CreatedAt:    "2025-01-01T00:00:00Z",
			UpdatedAt:    "2025-01-01T00:00:00Z",
		}
	}
	return users
}
