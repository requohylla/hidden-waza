// user_handler.go: ユーザー登録・ログインハンドラー（API DTO利用）

package handler

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
)

type UserHandler struct {
	Repo UserRepository
}

type UserRepository interface {
	CreateUser(user *domain.User) error
	FindByEmail(email domain.Email) (*domain.User, error)
}

func (h *UserHandler) Register(c echo.Context) error {
	var req dto.UserRegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	hash, err := domain.NewPasswordHash(req.Password)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid password"})
	}
	nowStr := time.Now().Format("2006-01-02 15:04:05")
	user := &domain.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hash,
		CreatedAt:    nowStr,
		UpdatedAt:    nowStr,
	}
	if err := h.Repo.CreateUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create user"})
	}
	resp := dto.UserRegisterResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}
	return c.JSON(http.StatusCreated, resp)
}

func (h *UserHandler) Login(c echo.Context) error {
	var req dto.UserLoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	user, err := h.Repo.FindByEmail(req.Email)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "user not found"})
	}
	if !user.PasswordHash.Verify(req.Password) {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid password"})
	}

	// JWT生成
	secret := []byte("your-secret-key") // TODO: .env等で管理
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   string(user.Email),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	tokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := tokenObj.SignedString(secret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "token generation failed"})
	}

	resp := dto.UserLoginResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Token:    tokenStr,
	}
	return c.JSON(http.StatusOK, resp)
}
