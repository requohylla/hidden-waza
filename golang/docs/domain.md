# ドメイン層の役割（本プロジェクトの場合）

## ドメイン層とは

このプロジェクトにおける「ドメイン層」は、
**業務ルールやビジネスロジックを表現する「エンティティ」や「値オブジェクト」などを定義する層**です。

- システムの中心的な業務概念（例：職務経歴書、スキル、職歴、ユーザーなど）を型・メソッドとして集約
- DBテーブルやDTOとは独立し、業務ルールや振る舞いを担う
- データ構造の定義だけでなく、ドメイン知識や不変条件なども表現

---

## 役割・設計方針

- **エンティティ・値オブジェクトとしての役割**
  ドメイン層は「業務ルールや不変条件を持つ型」として設計されています。
  - 例：Resume, Skill, Experience, User など
  - 必要に応じてメソッドを持ち、業務的なバリデーションや振る舞いを実装

- **DTOやDBモデルとの違い**
  ドメイン層は「システムの本質的な業務概念」を表現し、
  API入出力用のDTOや、DBアクセス用の構造体（モデル）とは明確に分離されています。

- **リレーションや業務ルールの表現**
  Resume→Skill/Experienceのような関連や、業務的な整合性も構造体やメソッドで表現します。

---

## 具体例

- [`Resume`](services/hidden_waza/internal/domain/resume.go:6)  
  職務経歴書のデータ構造（ID, UserID, Title, Skills, Experiences など）

- [`Skill`](services/hidden_waza/internal/domain/skill.go:4)  
  スキル情報のデータ構造

- [`Experience`](services/hidden_waza/internal/domain/experience.go:4)  
  職歴情報のデータ構造

- [`User`](services/hidden_waza/internal/domain/user.go:4)  
  ユーザー情報のデータ構造

---

## 補足

- ドメイン層は「model層」と呼ばれることも多いです
- ビジネスロジックは基本的にサービス層やハンドラー層に記述し、  
  ドメイン層は「データの型・構造」を担保する役割に徹します
