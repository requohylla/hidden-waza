# ドメイン層の役割（本プロジェクトの場合）

## ドメイン層とは

このプロジェクトにおける「ドメイン層」は、  
**DBテーブル構造に対応した「モデル（構造体）」を定義する層**です。

- データベースの各テーブル（users, resumes, skills, experiences など）に対応
- アプリケーション内で「データの受け渡し・永続化の単位」として利用
- ビジネスロジックは基本的に持たず、「データ構造の定義」が主な役割

---

## 役割・設計方針

- **モデル（構造体）としての役割**  
  ドメイン層は「DBの1レコード＝Go構造体1つ」となるよう設計されています。
  - 例：Resume, Skill, Experience, User など

- **DTOやAPI層との違い**  
  ドメイン層は「アプリ内の標準的なデータ表現」として使われ、  
  API入出力用のDTOや、DBアクセス用のリポジトリ層とは明確に分離されています。

- **リレーションの表現**  
  Resume→Skill/Experienceのような関連も構造体のフィールドで表現します。

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
