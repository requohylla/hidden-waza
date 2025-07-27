// user.go: usersテーブル用ドメインモデル
package domain

type User struct {
	ID           uint         `json:"id"`
	Username     string       `json:"username"`
	Email        Email        `json:"email"`
	PasswordHash PasswordHash `json:"password_hash"`
	CreatedAt    string       `json:"created_at"`
	UpdatedAt    string       `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
