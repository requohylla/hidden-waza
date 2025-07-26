// 職務経歴書APIハンドラ
package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
)

type ResumeHandler struct {
	repo *repository.ResumeRepository
}

func NewResumeHandler(repo *repository.ResumeRepository) *ResumeHandler {
	return &ResumeHandler{repo: repo}
}

func (h *ResumeHandler) CreateResume(w http.ResponseWriter, r *http.Request) {
	var req dto.ResumeDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	resume := domain.Resume{
		UserID:      req.UserID,
		Title:       req.Title,
		Summary:     req.Summary,
		Skills:      convertSkillDTOs(req.Skills),
		Experiences: convertExperienceDTOs(req.Experiences),
	}
	if err := h.repo.Create(&resume); err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// SkillDTOからdomain.Skillへの変換
func convertSkillDTOs(dtos []dto.SkillDTO) []domain.Skill {
	var skills []domain.Skill
	for _, s := range dtos {
		skills = append(skills, domain.Skill{
			Type:     s.Type,
			MasterID: s.MasterID,
			Level:    s.Level,
			Years:    s.Years,
		})
	}
	return skills
}

// ExperienceDTOからdomain.Experienceへの変換
func convertExperienceDTOs(dtos []dto.ExperienceDTO) []domain.Experience {
	var exps []domain.Experience
	for _, e := range dtos {
		exps = append(exps, domain.Experience{
			Company:      e.Company,
			Position:     e.Position,
			StartDate:    e.StartDate,
			EndDate:      e.EndDate,
			Description:  e.Description,
			PortfolioURL: e.PortfolioURL,
		})
	}
	return exps
}

func (h *ResumeHandler) GetResumes(w http.ResponseWriter, r *http.Request) {
	resumes, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(resumes)
}

func (h *ResumeHandler) GetResumeByID(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid id"})
	}
	resume, err := h.repo.GetByID(uint(id))
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, resume)
}

func (h *ResumeHandler) GetResumesByUserID(c echo.Context) error {
	userIDStr := c.Param("user_id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid user_id"})
	}
	resumes, err := h.repo.GetByUserID(uint(userID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "DB error"})
	}
	return c.JSON(http.StatusOK, resumes)
}
