# Dockerクリーンアップ手順

## ディスクスペース不足の解決方法

### 1. 基本的なクリーンアップコマンド

```bash
# 使用されていないコンテナ、ネットワーク、イメージ、ビルドキャッシュを削除
docker system prune -a -f

# ボリューム含むすべてのリソースを削除（注意：データが失われます）
docker system prune -a --volumes -f
```

### 2. 個別リソースのクリーンアップ

```bash
# 停止中のコンテナを削除
docker container prune -f

# 使用されていないイメージを削除
docker image prune -a -f

# 使用されていないネットワークを削除
docker network prune -f

# 使用されていないボリュームを削除（注意：データが失われる可能性があります）
docker volume prune -f

# ビルドキャッシュを削除
docker builder prune -a -f
```

### 3. 特定のイメージやコンテナの削除

```bash
# 特定のイメージを削除
docker rmi $(docker images -q)

# すべてのコンテナを停止・削除
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

### 4. ディスクスペース使用量の確認

```bash
# Dockerのディスク使用量を確認
docker system df

# 詳細なディスク使用量を確認
docker system df -v
```

### 5. ビルド前の推奨クリーンアップ

```bash
#!/bin/bash
# pre-build-cleanup.sh

echo "=== Docker クリーンアップ開始 ==="

# 現在のディスク使用量を表示
echo "クリーンアップ前のディスク使用量:"
docker system df

# 基本的なクリーンアップ
echo "不要なリソースを削除中..."
docker system prune -f

# ビルドキャッシュのクリーンアップ
echo "ビルドキャッシュを削除中..."
docker builder prune -f

# クリーンアップ後のディスク使用量を表示
echo "クリーンアップ後のディスク使用量:"
docker system df

echo "=== Docker クリーンアップ完了 ==="
```

### 6. 本番環境でのビルド手順

```bash
# 1. クリーンアップの実行
chmod +x pre-build-cleanup.sh
./pre-build-cleanup.sh

# 2. 本番環境でのビルド
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. コンテナの起動
docker-compose -f docker-compose.prod.yml up -d
```

### 7. 定期的なメンテナンス

```bash
# crontabで定期的にクリーンアップを実行（例：毎週日曜日午前2時）
0 2 * * 0 docker system prune -f > /var/log/docker-cleanup.log 2>&1
```

## 注意事項

- `docker system prune --volumes` は永続化されたデータも削除するため、本番環境では注意が必要です
- クリーンアップ前に重要なデータのバックアップを取ることを推奨します
- ディスクスペースが不足している場合は、まずビルドキャッシュの削除から始めてください