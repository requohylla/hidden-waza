# API設計・実装詳細

## 概要

本APIは職務経歴書（Resume）の作成・取得を行うRESTfulなエンドポイントを提供します。  
ここではエンドポイント仕様・DTO・バリデーション・エラー設計に加え、実装の流れや内部構造（ハンドラー・ドメイン・リポジトリ連携）まで詳細に解説します。

---

## エンドポイント仕様

### POST /resumes

- 概要: 職務経歴書を新規登録
- バリデーション: user_id, title, skills, experiencesは必須
- 主なエラー: 400（JSON不正/必須項目不足）, 500（DB障害）

#### リクエスト例
```json
{
  "user_id": 1,
  "title": "バックエンドエンジニア",
  "summary": "Go言語を中心にAPI開発経験あり",
  "skills": [
    { "type": "language", "master_id": 2, "level": "上級", "years": 5 }
  ],
  "experiences": [
    {
      "company": "株式会社サンプル",
      "position": "エンジニア",
      "start_date": "2020-01-01",
      "end_date": "2023-06-30",
      "description": "API設計・開発を担当",
      "portfolio_url": "https://portfolio.example.com"
    }
  ]
}
```

#### 実装フロー
1. ハンドラーでJSONデコード（`json.NewDecoder(r.Body).Decode(&req)`）
2. バリデーション（必須項目・型チェック）
3. DTO→ドメイン変換（`domain.Resume`へマッピング）
4. リポジトリ呼び出し（`repo.Create(&resume)`でDB登録）
5. 成功時: 201返却、失敗時: エラーコード返却

#### 関連コード
- [`ResumeHandler.CreateResume()`](services/hidden_waza/internal/handler/resume_handler.go:23)
- [`ResumeRepository.Create()`](services/hidden_waza/internal/repository/resume_repository.go:17)
- [`ResumeDTO`](services/hidden_waza/api/v1/dto/resume_dto.go:19)
- [`Resumeドメイン`](services/hidden_waza/internal/domain/resume.go:6)

---

### GET /resumes

- 概要: 全職務経歴書を取得
- 実装: リポジトリの`GetAll()`でDBから全件取得し、JSONで返却
- 関連コード: [`ResumeHandler.GetResumes()`](services/hidden_waza/internal/handler/resume_handler.go:73)

---

### GET /resumes/:id

- 概要: 指定IDの職務経歴書を取得
- 実装: パスパラメータをint変換→リポジトリ`GetByID()`呼び出し
- エラー: id不正時400, 見つからなければ404
- 関連コード: [`ResumeHandler.GetResumeByID()`](services/hidden_waza/internal/handler/resume_handler.go:82)

---

### GET /resumes/user/:user_id

- 概要: 指定ユーザーの職務経歴書一覧取得
- 実装: パスパラメータをint変換→リポジトリ`GetByUserID()`呼び出し
- 関連コード: [`ResumeHandler.GetResumesByUserID()`](services/hidden_waza/internal/handler/resume_handler.go:95)

---

## DTO・ドメイン構造

### ResumeDTO
- [`ResumeDTO`](services/hidden_waza/api/v1/dto/resume_dto.go:19)
- フィールド: user_id, title, summary, skills, experiences

### Resumeドメイン
- [`Resume`](services/hidden_waza/internal/domain/resume.go:6)
- DB永続化用の構造体。ID, UserID, Title, Summary, Skills, Experiences, CreatedAt, UpdatedAt

---

## バリデーション仕様

- user_id, title, skills, experiencesは必須
- skills/experiencesは空配列可だが省略不可
- 型不一致や必須項目不足は400返却

---

## エラー設計

- 400 Bad Request: JSON不正、必須項目不足、型不一致
- 404 Not Found: 指定IDが存在しない
- 500 Internal Server Error: DB障害等

### エラーレスポンス例
```json
{ "error": "invalid id" }
```

---

## 内部構造・処理の流れ

1. **ハンドラー層**  
   - HTTPリクエスト受信
   - JSONデコード・バリデーション
   - DTO→ドメイン変換
   - リポジトリ呼び出し

2. **リポジトリ層**  
   - DB操作（Create, GetAll, GetByID, GetByUserID）
   - GORMを利用し永続化

3. **ドメイン層**  
   - DBテーブルに対応した構造体
   - ビジネスロジックを保持

---

## サンプル実装フロー（POST /resumes）

1. クライアントがJSONでリクエスト送信
2. ハンドラーでDTOにデコード
3. 必須項目チェック
4. ドメイン構造体へ変換
5. リポジトリでDB登録
6. 成功時201、失敗時エラー返却
