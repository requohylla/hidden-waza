// language_handler.go: 言語一覧取得APIハンドラ
package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
)

type LanguageHandler struct {
	repo *repository.LanguageRepository
}

func NewLanguageHandler(repo *repository.LanguageRepository) *LanguageHandler {
	return &LanguageHandler{repo: repo}
}

// GET /api/v1/languages
func (h *LanguageHandler) GetLanguageList(c echo.Context) error {
	langList, err := h.repo.FindAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch language list"})
	}
	var dtoList []dto.LanguageDTO
	for _, lang := range langList {
		dtoList = append(dtoList, dto.LanguageDTO{
			ID:   lang.ID,
			Name: lang.Name,
		})
	}
	return c.JSON(http.StatusOK, dtoList)
}
