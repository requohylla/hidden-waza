#!/bin/sh
set -e

# マイグレーション
echo "=== Running goose migration ==="
/goose -dir /migrations mysql "$DB_USER:$DB_PASSWORD@tcp($DB_HOST:$DB_PORT)/$DB_NAME?parseTime=true" up

# シーダー
echo "=== Running seeder ==="
/seeder

# 本体起動
echo "=== Starting main app ==="
exec /main