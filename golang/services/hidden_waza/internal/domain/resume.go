/*
resume.go

Go言語の構造体（struct）は、複数の型付きフィールドをまとめて一つの型として扱えるユーザー定義型です。
Resume構造体は、
- DBテーブル（resumes）の1レコードを表現しつつ、
- システム内で「ユーザーの職務経歴情報を集約・操作する」ための中心的な型です。

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
	UserID      uint         `json:"user_id"`
	Title       string       `json:"title"`
	Summary     string       `json:"summary"`
	Skills      []Skill      `json:"skills"`
	Experiences []Experience `json:"experiences"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

func (Resume) TableName() string {
	return "resumes"
}
