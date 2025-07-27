# 動作確認・ローカル開発環境構築ガイド（完全詳細版）

このドキュメントは、本プロジェクトの動作確認・ローカル開発・APIテスト・DB初期化・運用Tipsまで「深く」解説します。  
新規開発者やLLMが迷わず環境構築・検証できるよう、各工程の背景や注意点も小見出し付きで記載しています。

---

## 1. 前提条件・事前準備

### 1.1 必要なソフトウェア

- Go 1.20以上（`go version`で確認）
- MariaDB/MySQL（バージョンは開発環境に合わせる）
- [`goose`](https://github.com/pressly/goose)（DBマイグレーションツール）

### 1.2 設定ファイルの準備

- `.env` … 環境変数（DB接続・ポート番号など）
- `services/hidden_waza/config/db.yaml` … DB接続情報
- `go mod tidy`で依存パッケージを最新化

### 1.3 推奨環境

- Linux/Mac/WSL推奨（Windowsでも動作可だが一部コマンド差異あり）

---

## 2. DBセットアップ（gooseによるマイグレーション）

### 2.1 DB設定ファイル編集

- [`services/hidden_waza/config/db.yaml`](services/hidden_waza/config/db.yaml) を環境に合わせて編集  
  - DB名・ユーザー・パスワード・ホスト・ポートを正しく設定

### 2.2 DB作成

```sh
mysql -u root -p -e "CREATE DATABASE hidden_waza_dev DEFAULT CHARACTER SET utf8mb4;"
```

### 2.3 gooseインストール

```sh
go install github.com/pressly/goose/v3/cmd/goose@latest
```

### 2.4 マイグレーション実行

```sh
cd services/hidden_waza/db/migrations
goose mysql "ユーザー:パスワード@tcp(ホスト:ポート)/DB名?parseTime=true" up
```
- 例: `goose mysql "root:password@tcp(localhost:3306)/hidden_waza_dev?parseTime=true" up`
- マイグレーションSQLはバージョン管理されており、DBスキーマの再現性を担保

### 2.5 マイグレーションのリセット・再実行

- `goose down`でロールバック、`goose up`で再適用可能
- バージョン管理の恩恵で、DBスキーマの状態を柔軟に管理

---

## 3. ダミーデータ投入（Seeder）

### 3.1 Seederの役割

- 開発・テスト用のサンプルデータ投入
- 本番投入禁止

### 3.2 投入手順

- [`docs/db/seeder.md`](docs/db/seeder.md) の手順に従い、Seederコマンドでサンプルデータを投入

### 3.3 注意点

- 投入前に既存データのバックアップやtruncate推奨
- 外部キー制約や重複データに注意

---

## 4. サーバ起動・環境変数

### 4.1 設定ファイル配置

- `.env`や`db.yaml`を正しく配置

### 4.2 サーバ起動コマンド

```sh
cd services/hidden_waza/cmd/hidden_waza
go run main.go
```

### 4.3 ポート・DB接続先の制御

- `.env`や`db.yaml`で制御
- ログ出力やエラー内容は標準出力・ファイルで確認

---

## 5. API動作確認・テスト

### 5.1 主要エンドポイント

- POST `/api/v1/resume/post` … 職務経歴書新規登録
- GET `/resumes` … 一覧取得
- GET `/resumes/:id` … 詳細取得
- GET `/resumes/user/:user_id` … ユーザー別一覧

### 5.2 curlによるテスト例

#### resume登録

```sh
curl -X POST http://localhost:8080/api/v1/resume \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

#### ユーザー登録
``` sh
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"testuser@example.com","password":"password123"}'
```

#### ユーザー認証
``` sh
curl -X POST http://localhost:8080/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}'d
```

### 5.3 レスポンス・エラー確認

- レスポンス: 201 Created（成功時）
- エラー時はHTTPステータス・レスポンスボディ・サーバログを確認

---

## 6. DBリセット・再投入Tips

### 6.1 テーブルtruncate・Seeder再実行

- テストや開発でデータをリセットしたい場合は、各テーブルをtruncate後、Seeder再実行

### 6.2 gooseによるバージョン管理

- `goose down`/`goose up`でマイグレーションのバージョンを柔軟に操作

---

## 7. よくあるトラブル・FAQ

### 7.1 DB接続エラー

- db.yamlや.envの設定ミス、DB起動忘れ、ユーザー権限不足

#### 【実例】権限不足エラーの詳細と対処

- **現象例**: gooseやアプリ起動時に「Access denied for user 'xxx'@'localhost'」や「権限がありません」等のエラーが発生
- **主な原因**:
  - DBユーザーに「CREATE」「ALTER」「INSERT」「UPDATE」「DELETE」「SELECT」など必要な権限が付与されていない
  - マイグレーション時は「ALTER」「CREATE」「DROP」権限も必要
  - Seederやアプリ本体は「INSERT」「UPDATE」「DELETE」「SELECT」権限が必要
- **対処例**:
  ```sql
  GRANT ALL PRIVILEGES ON hidden_waza_dev.* TO 'your_user'@'localhost';
  FLUSH PRIVILEGES;
  ```
  - 最小権限運用の場合は必要な権限のみ個別に付与
  - 権限変更後は必ず`FLUSH PRIVILEGES;`を実行
- **補足**:
  - 権限不足はCI/CDや本番環境移行時にも発生しやすいので、事前に権限一覧を確認
  - 権限エラー時はMySQLのエラーログやgoose/アプリの標準出力を確認

### 7.2 マイグレーション失敗

- gooseコマンド・SQLファイルのパス・DB接続情報を再確認

### 7.3 APIエラー

- リクエストJSONの構造・必須項目・型を再確認。詳細は[`docs/api.md`](docs/api.md)参照

### 7.4 Seeder投入失敗

- 既存データの外部キー制約や重複に注意。truncate推奨

---

## 8. 補足・運用Tips

### 8.1 本番運用時の注意

- 本番環境では必ず.envやconfigの機密情報管理に注意

### 8.2 DB分離

- テスト用DBと本番DBは分離推奨

### 8.3 CI/CD・自動化

- マイグレーション・SeederはCI/CDや自動化スクリプトでの運用も推奨

### 8.4 参考ドキュメント

- 詳細なAPI仕様・データ構造は [`docs/api.md`](docs/api.md)・[`docs/domain.md`](docs/domain.md) を参照
