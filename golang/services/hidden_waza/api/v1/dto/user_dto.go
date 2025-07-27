package dto

import "github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"

type UserRegisterRequest struct {
	Username string       `json:"username"`
	Email    domain.Email `json:"email"`
	Password string       `json:"password"`
}

type UserRegisterResponse struct {
	ID       uint         `json:"id"`
	Username string       `json:"username"`
	Email    domain.Email `json:"email"`
}

type UserLoginRequest struct {
	Email    domain.Email `json:"email"`
	Password string       `json:"password"`
}

type UserLoginResponse struct {
	ID       uint         `json:"id"`
	Username string       `json:"username"`
	Email    domain.Email `json:"email"`
}
