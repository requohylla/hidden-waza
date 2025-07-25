// 職務経歴書APIハンドラ
package handler

import (
	"encoding/json"
	"github.com/requohylla/hidden-waza/services/hidden_waza/api/v1/dto"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/domain"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
	"net/http"
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
		Name:        req.Name,
		Title:       req.Title,
		Description: req.Description,
		Skills:      req.Skills,
		Experience:  req.Experience,
	}
	if err := h.repo.Create(&resume); err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (h *ResumeHandler) GetResumes(w http.ResponseWriter, r *http.Request) {
	resumes, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(resumes)
}
