# ハンドラー層の役割

## ハンドラー層とは

ハンドラー層は「HTTPリクエストとアプリケーション内部処理の橋渡し」を担う層です。  
このプロジェクトでは、APIエンドポイントごとにハンドラーメソッドを用意し、  
リクエストの受信・バリデーション・DTO変換・リポジトリ呼び出し・レスポンス生成までを担当します。

---

## 役割・設計方針

- **エンドポイントごとの処理分岐**  
  例：POST /resumes → CreateResume, GET /resumes → GetResumes

- **リクエストのデコード・バリデーション**  
  JSONデータをDTOに変換し、必須項目や型のチェックを行う

- **ドメイン層・リポジトリ層との連携**  
  DTOからドメイン構造体へ変換し、リポジトリ経由でDB操作

- **レスポンス生成**  
  成功時・失敗時のHTTPステータスやエラーメッセージを返却

---

## API処理フロー例（POST /resumes）

1. HTTPリクエスト受信
2. JSONデコード（DTOへ）
3. バリデーション
4. ドメイン構造体へ変換
5. リポジトリでDB登録
6. 結果に応じて201/400/500など返却

---

## バリデーション・エラー処理

- 必須項目不足や型不一致は400 Bad Request
- DB障害等は500 Internal Server Error
- パスパラメータ不正時は400、データ未検出時は404

---

## 関連コード例

- [`ResumeHandler.CreateResume()`](services/hidden_waza/internal/handler/resume_handler.go:23)
- [`ResumeHandler.GetResumes()`](services/hidden_waza/internal/handler/resume_handler.go:73)
- [`ResumeHandler.GetResumeByID()`](services/hidden_waza/internal/handler/resume_handler.go:82)
- [`ResumeHandler.GetResumesByUserID()`](services/hidden_waza/internal/handler/resume_handler.go:95)
