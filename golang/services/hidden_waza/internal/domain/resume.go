/*
resume.go

【domain層の位置づけについて】
このファイルのResume構造体は「ドメインモデル」ではなく「ドメインエンティティ」として、
業務ルールやビジネスロジックを表現する役割を担います。
単なるDBモデル（永続化用構造体）やDTO（データ転送用構造体）とは異なり、
「システムの中心的な業務概念・振る舞い」を型・メソッドとして集約します。

- DBテーブル（resumes）の1レコードを表現するだけでなく、
- システム内で「ユーザーの職務経歴情報を集約・操作する」ための本質的な型です。

【Go言語仕様・実装面での深い特徴】
1. Skills・Experiencesは自作のドメイン構造体（[`Skill`](services/hidden_waza/internal/domain/skill.go), [`Experience`](services/hidden_waza/internal/domain/experience.go)）のスライスとして保持。
  - Goの構造体は「データの集約」だけでなく、メソッドを定義することで「振る舞い（ロジック）」も持たせられる。
  - 例えばSkill構造体に「IsValid()」や「カテゴリ判定」などのメソッドを追加し、Resume構造体のメソッドから各Skill/Experienceの振る舞いを呼び出せる。
  - スライスを使うことで、関連エンティティの可変長管理や、for-rangeによる柔軟な操作が可能。

2. ドメインモデルはDTOやDB構造と分離されている。
  - Goは「型安全」な言語であり、DTO⇔ドメイン変換を明示的に実装することで、外部仕様と内部ロジックの独立性を担保できる。
  - API層とのデータ受け渡し時は [`resume_handler.go`](services/hidden_waza/internal/handler/resume_handler.go) でDTO⇔ドメイン変換を明示的に実装。
  - DBアクセス時は [`resume_repository.go`](services/hidden_waza/internal/repository/resume_repository.go) で永続化処理を抽象化。
  - これにより、外部仕様やDB設計が変わっても、ドメインロジックの影響範囲を最小化できる。

3. GORMの構造体タグ（`json:"..."`）を利用し、API層やDB層とのマッピングを柔軟に制御可能。
  - Goのタグはリフレクションを用いてシリアライズ/デシリアライズ時のフィールド名や挙動を柔軟に制御できる。
  - ただし、ドメインモデルの本質は「業務ルールの表現」であり、タグや外部仕様に引きずられすぎない設計が推奨される。

4. Goは「埋め込み（匿名フィールド）」による擬似的な継承や、インターフェースによる抽象化もサポートする。
  - ドメインモデルの拡張や共通化も柔軟に設計できる。

このようなGoの言語仕様と設計思想を活かすことで、
- ドメイン知識を型・メソッドとして集約し、
- システム全体の保守性・拡張性・テスト容易性を高める堅牢な基盤を実現しています。
*/
package domain

import "time"

type Resume struct {
	ID          uint         `json:"id"`
	UserID      uint         `json:"user_id" gorm:"column:user_id"`
	Title       string       `json:"title"`
	Summary     string       `json:"summary"`
	Skills      []Skill      `json:"skills"`
	Experiences []Experience `json:"experiences"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	Verified    bool         `json:"verified"`
}

/// 職務経歴書の業務的バリデーション
func (r *Resume) IsValid() bool {
	if r.Title == "" || r.UserID == 0 {
		return false
	}
	for _, s := range r.Skills {
		if !s.IsValid() {
			return false
		}
	}
	for _, e := range r.Experiences {
		if !e.IsValid() {
			return false
		}
	}
	return true
}

func (r *Resume) AddSkill(skill Skill) {
	r.Skills = append(r.Skills, skill)
}

func (r *Resume) RemoveSkill(skillID uint) {
	newSkills := make([]Skill, 0, len(r.Skills))
	for _, s := range r.Skills {
		if s.ID != skillID {
			newSkills = append(newSkills, s)
		}
	}
	r.Skills = newSkills
}

func (Resume) TableName() string {
	return "resumes"
}
