/*
resume_handler.go

このファイルは職務経歴書（Resume）に関するAPIリクエストを処理するハンドラを定義します。
主な役割は以下の通りです：
- API層（JSONリクエスト/レスポンス）とドメイン層（internal/domain/）の橋渡し
- DTO（[`ResumeDTO`](services/hidden_waza/api/v1/dto/resume_dto.go)）とドメインモデル（[`Resume`](services/hidden_waza/internal/domain/resume.go)）の相互変換
- DB操作は [`ResumeRepository`](services/hidden_waza/internal/repository/resume_repository.go) を通じて行う
- 変換関数（convertSkillDTOs, convertExperienceDTOs等）でDTOとドメインモデルの差異を吸収し、API仕様と内部構造の独立性を保つ

この設計により、API仕様変更や内部DB構造変更の影響を最小限に抑え、保守性・拡張性を高めています。
*/
package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

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
	// DTO（ResumeDTO）からドメインモデル（Resume）へ変換
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

	// 登録したResumeをDTOに変換して返す
	resumeDTO := dto.ResumeDTO{
		ID:          resume.ID,
		UserID:      resume.UserID,
		Title:       resume.Title,
		Summary:     resume.Summary,
		Skills:      convertDomainSkillsToDTO(resume.Skills),
		Experiences: convertDomainExperiencesToDTO(resume.Experiences),
		CreatedAt:   resume.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   resume.UpdatedAt.Format(time.RFC3339),
		Verified:    resume.Verified,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resumeDTO)
}

func (h *ResumeHandler) UpdateResume(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid id"})
	}

	var req dto.ResumeDTO
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	// DTO→ドメイン
	resume := domain.Resume{
		ID:          uint(id),
		UserID:      req.UserID,
		Title:       req.Title,
		Summary:     req.Summary,
		Skills:      convertSkillDTOs(req.Skills),
		Experiences: convertExperienceDTOs(req.Experiences),
	}

	if err := h.repo.Update(&resume); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "DB error"})
	}

	// 更新後のDTO返却
	resumeDTO := dto.ResumeDTO{
		ID:          resume.ID,
		UserID:      resume.UserID,
		Title:       resume.Title,
		Summary:     resume.Summary,
		Skills:      convertDomainSkillsToDTO(resume.Skills),
		Experiences: convertDomainExperiencesToDTO(resume.Experiences),
		CreatedAt:   resume.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   resume.UpdatedAt.Format(time.RFC3339),
		Verified:    resume.Verified,
	}
	return c.JSON(http.StatusOK, resumeDTO)
}

// SkillDTOからdomain.Skillへの変換
// DTOとドメインモデルの構造やフィールド名が異なる場合もここで吸収可能
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

// domain.Skill → dto.SkillDTO変換
func convertDomainSkillsToDTO(skills []domain.Skill) []dto.SkillDTO {
	var dtos []dto.SkillDTO
	for _, s := range skills {
		dtos = append(dtos, dto.SkillDTO{
			Type:     s.Type,
			MasterID: s.MasterID,
			Level:    s.Level,
			Years:    s.Years,
		})
	}
	return dtos
}

// ExperienceDTOからdomain.Experienceへの変換
// DTOとドメインモデルの構造やフィールド名が異なる場合もここで吸収可能
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

// domain.Experience → dto.ExperienceDTO変換
func convertDomainExperiencesToDTO(exps []domain.Experience) []dto.ExperienceDTO {
	var dtos []dto.ExperienceDTO
	for _, e := range exps {
		dtos = append(dtos, dto.ExperienceDTO{
			Company:      e.Company,
			Position:     e.Position,
			StartDate:    e.StartDate,
			EndDate:      e.EndDate,
			Description:  e.Description,
			PortfolioURL: e.PortfolioURL,
		})
	}
	return dtos
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
	// domain.Resume → dto.ResumeDTO 変換
	dtoResume := dto.ResumeDTO{
		UserID:      resume.UserID,
		Title:       resume.Title,
		Summary:     resume.Summary,
		Skills:      convertDomainSkillsToDTO(resume.Skills),
		Experiences: convertDomainExperiencesToDTO(resume.Experiences),
		CreatedAt:   resume.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   resume.UpdatedAt.Format(time.RFC3339),
		Verified:    resume.Verified,
	}
	return c.JSON(http.StatusOK, dtoResume)
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

// DELETE /resumes/:id
func (h *ResumeHandler) DeleteResume(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid id"})
	}
	if err := h.repo.Delete(uint(id)); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "DB error"})
	}
	return c.NoContent(http.StatusNoContent)
}
