// tool_handler.go: ツール一覧取得APIハンドラ
package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
)

type ToolHandler struct {
	repo *repository.ToolRepository
}

func NewToolHandler(repo *repository.ToolRepository) *ToolHandler {
	return &ToolHandler{repo: repo}
}

// GET /api/v1/tools
func (h *ToolHandler) GetToolList(c echo.Context) error {
	toolList, err := h.repo.FindAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch tool list"})
	}
	var dtoList []dto.ToolDTO
	for _, tool := range toolList {
		dtoList = append(dtoList, dto.ToolDTO{
			ID:   tool.ID,
			Name: tool.Name,
		})
	}
	return c.JSON(http.StatusOK, dtoList)
}
