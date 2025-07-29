#!/bin/sh
set -e

# マイグレーション
echo "=== Running goose migration ==="
goose mysql "$DB_USER:$DB_PASSWORD@tcp($DB_HOST:$DB_PORT)/$DB_NAME?parseTime=true" up

# シーダー
echo "=== Running seeder ==="
go run /app/services/hidden_waza/db/seeder/cmd/seeder

# 本体起動
echo "=== Starting main app ==="
exec /main