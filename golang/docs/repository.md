# リポジトリ層の役割

## リポジトリ層とは

リポジトリ層は「ドメインモデルとDB（永続化層）の橋渡し」を担う層です。  
このプロジェクトでは、GORMを利用してドメイン構造体の保存・取得・検索などを担当します。

---

## 役割・設計方針

- **永続化の抽象化**  
  DBアクセスの詳細（SQLやORM操作）を隠蔽し、  
  アプリケーションの他層からは「ドメイン構造体の保存・取得」として利用できるようにします。

- **ドメインモデル単位で操作**  
  例：ResumeRepositoryはResume構造体をCreate/Getするメソッドを提供

- **ビジネスロジックは持たない**  
  リポジトリ層は「データの保存・取得」に専念し、業務ロジックは持ちません。

---

## 主要メソッドと使い方

- [`ResumeRepository.Create()`](services/hidden_waza/internal/repository/resume_repository.go:17)  
  ドメイン構造体をDBに保存

- [`ResumeRepository.GetAll()`](services/hidden_waza/internal/repository/resume_repository.go:21)  
  全件取得

- [`ResumeRepository.GetByID()`](services/hidden_waza/internal/repository/resume_repository.go:33)  
  主キー指定で1件取得

- [`ResumeRepository.GetByUserID()`](services/hidden_waza/internal/repository/resume_repository.go:27)  
  ユーザーIDで絞り込み取得

---

## DBアクセスの流れ

1. ハンドラーやサービス層からリポジトリのメソッドを呼び出す
2. GORM経由でDBにアクセスし、ドメイン構造体にマッピング
3. 結果を呼び出し元に返却

---

## 補足

- DBの種類や実装を変更しても、リポジトリ層のインターフェースを保てば他層への影響を最小化できる
- テスト時はモック実装に差し替えやすい
