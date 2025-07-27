// os_handler.go: OS一覧取得APIハンドラ
package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
)

type OSHandler struct {
	repo *repository.OSRepository
}

func NewOSHandler(repo *repository.OSRepository) *OSHandler {
	return &OSHandler{repo: repo}
}

// GET /api/v1/os
func (h *OSHandler) GetOSList(c echo.Context) error {
	osList, err := h.repo.FindAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch OS list"})
	}
	var dtoList []dto.OSDTO
	for _, os := range osList {
		dtoList = append(dtoList, dto.OSDTO{
			ID:   os.ID,
			Name: os.Name,
		})
	}
	return c.JSON(http.StatusOK, dtoList)
}
