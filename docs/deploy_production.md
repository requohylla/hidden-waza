# 本番環境デプロイ手順

## 1. 各プロジェクトで.env.productionを作成
- `.env.production.sample` をコピーして `.env.production` を作成し、必要な値を設定
  - 例: `cp .env.production.sample .env.production`

## 2. 本番用イメージのビルド
- docker-composeのversionが古いと使えないので注意
```
docker-compose -f docker-compose.prod.yml --env-file .env.production build
```

## 3. コンテナ起動
```
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 4. golangサービスは起動時に自動でマイグレーション・シーダーが実行されます

## 5. 停止・削除
```
docker-compose -f docker-compose.prod.yml down
```

## tips

### 容量が足りなくてエラーが出る場合
```
docker system prune -a --volumes -f
```