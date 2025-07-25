# Seederコマンド利用手順

## 概要
`db/seeder/seeder.go` の `RunSeeder` を呼び出すことで、users, resumes, languages, tools, os, skills, experiences 各テーブルにサンプルデータを一括投入できます。

## 使い方

1. DB設定（`services/hidden_waza/config/db.yaml`）を正しく記載してください。
2. 以下のコマンドでSeederを実行します。

```sh
cd services/hidden_waza/cmd/hidden_waza
go run seeder.go
```

または、main.go等から `seeder.RunSeeder()` を呼び出してください。

## 注意点

- 既存データがある場合、重複や外部キー制約エラーが発生することがあります。必要に応じてテーブルをtruncateしてください。
- データ件数は各テーブル100件（skills/experiencesは200件）ですが、`dummydata`の生成関数を修正すれば任意件数に変更可能です。
- パフォーマンステスト等で大量データが必要な場合は、`dummydata`の生成数を増やしてください。
- 本番DBには絶対に投入しないでください。