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

#### 調査コマンド

```
sudo du -x -h / | sort -r -h | head -10
```

```
docker system df
```

```
df -h
```

#### デーモンストップ
- これしないと削除できないファイルある
```
sudo systemctl stop docker
```

#### 削除コマンド

```
docker system prune -a --volumes -f
```

##### EC2の容量を増やす
- 参考サイト
- 20GBから30GBまでは増やせるっぽい(デフォルト8GB)
- 20GBまでは検証済み
https://skmkuma.com/%EF%BC%9Caws%E2%91%A2%EF%BC%9E%E7%84%A1%E6%96%99%E6%9E%A0%E3%81%A7ec2%E3%81%AE%E3%83%A1%E3%83%A2%E3%83%AA%E5%AE%B9%E9%87%8F%E3%82%92%E5%A2%97%E3%82%84%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B/