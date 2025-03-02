# 本リポジトリについて
技術学習のアウトプットを目的としたリポジトリです。<br>
技術力の証明や任せれそうな仕事の判断に使ってもらえたらと考えています。<br>

## 内容
- サービスを作るというよりは、技術力の証明・任せれそうな仕事の判断に使ってもらうという内容になります。

## 採用技術
- プロジェクト管理手法
  - monorepo
- Backend
  - Go + Echo + Air + MariaDB + gRPC
    - ORM、Bunも追加予定
- Backend For Frontend
  - Nest.js + GraphQL
- Frontend
  - Next.js + typescript
- Infra
  - AWS(またはCloudFlare)
    - コストは限界まで少なくしたい

### 技術選定に関して
学習したい技術をピックアップしているためプロジェクト成熟度等の合理的観点はスルーしています。<br>
ご配慮いただけますと幸いです。

### 追加予定

- CI/CD
- IaC(terraform)

# メモ 

## Golang

1. 実際に開発を進めて外部モジュールをimportした段階でgo mod tidyを実行する
1. go mod vendorで依存関係を保存(依存関係のあるパッケージが変更されてもvendor配下にコピーしたパッケージを使うことで影響を受けない)

# docker

## アプリケーションのビルドと実行
```
docker compose up --build
```

アプリケーションは http://localhost:8080(もしくは任意のポート番号) で利用可能になります。

# 参考ディレクトリ構成

## golang
https://github.com/golang-standards/project-layout/tree/master

### 解説
https://github.com/golang-standards/project-layout/blob/master/README_ja.md