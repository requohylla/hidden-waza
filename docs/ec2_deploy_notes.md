# EC2デプロイ時の詳細手順
- AI自動生成のため、キーワードリスト的な感じで使用してください

## 1. EC2インスタンスの準備
- AWSマネジメントコンソールにログイン
- EC2サービスから「インスタンスの起動」を選択
- Amazon Linux 2（またはUbuntu等）を選択
- インスタンスタイプはt3.medium以上推奨（用途に応じて選択）
- キーペアを作成・ダウンロード（SSH接続用）
- ストレージサイズを用途に応じて設定（最低20GB以上推奨）
- セキュリティグループで以下のポートを開放
  - 22（SSH）: 自分のIPのみ
  - 80（HTTP）: 全世界または必要な範囲
  - 443（HTTPS）: 全世界または必要な範囲
- インスタンス作成後、パブリックIPを控える

## 2. 必要なパッケージのインストール
- SSHでEC2に接続
```sh
ssh -i <キーペアファイル> ec2-user@<パブリックIP>
```
- システムアップデートとDocker等のインストール
```sh
sudo yum update -y
sudo yum install -y git docker
sudo usermod -aG docker ec2-user
sudo systemctl enable docker
sudo systemctl start docker
# docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
# Go（必要なら）
sudo yum install -y golang
# goose（Goのマイグレーションツール）
go install github.com/pressly/goose/v3/cmd/goose@latest
```
- 一度ログアウトし再ログイン（dockerグループ反映のため）

## 3. プロジェクトの配置

### 3-1. GitHubからcloneする場合
- GitHubでリポジトリのURLをコピー
- EC2上で作業ディレクトリを作成し、clone
```sh
mkdir -p ~/app
cd ~/app
git clone <リポジトリURL>
cd <プロジェクトディレクトリ>
```
- プライベートリポジトリの場合はSSH鍵を登録
```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
# GitHubに公開鍵を登録
```
- サブモジュールがある場合
```sh
git submodule update --init --recursive
```

### 3-2. SCP等でファイル転送する場合
- ローカルPCからEC2へSCPで転送
```sh
scp -i <キーペアファイル> -r <ローカルのプロジェクトパス> ec2-user@<パブリックIP>:~/app/
```
- 転送後、EC2上でディレクトリに移動
```sh
cd ~/app/<プロジェクトディレクトリ>
```

## 4. .env.productionの配置
- 各プロジェクトディレクトリに`.env.production`を配置
- `.env.production.sample`をコピーし、値を編集
```sh
cp .env.production.sample .env.production
vi .env.production
```
- 秘匿情報は安全な方法（AWS SSM, scp, ssh等）で配布

## 5. SSL証明書の取得・nginx設定
- Let's Encryptのcertbotをインストール
```sh
sudo yum install -y epel-release
sudo yum install -y certbot
sudo certbot certonly --standalone -d <ドメイン名>
```
- 証明書取得後、nginxの設定ファイルを編集しSSL対応
- 443番ポートをセキュリティグループで開放

## 6. DBボリュームの永続化
- docker-composeのvolumesでEBS等を利用
- EC2のEBS追加・マウント手順に従い、/var/lib/dockerやDBデータ用に設定

## 7. 本番用イメージのビルド・起動
```sh
docker-compose -f docker-compose.prod.yml --env-file .env.production build
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 8. ログ・監視
- CloudWatch Logsエージェントやfluentd等でログを永続化・監視
- 必要に応じて監視ツール（Zabbix, Datadog等）導入

## 9. OS/パッケージの定期アップデート
- 定期的に
```sh
sudo yum update -y
```
- セキュリティパッチ適用も忘れずに

---