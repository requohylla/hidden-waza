FROM golang:1.23.6

# docker-compose.ymlのargsから取得した環境変数
ARG APP_NAME

# ワーキングディレクトリの設定
WORKDIR /${APP_NAME}/golang/cmd/${APP_NAME}

# ホストのファイルをコンテナの作業ディレクトリにコピー
COPY . .

# モジュールの作成
RUN [ ! -f go.mod ] && go mod init github.com/requohylla/${APP_NAME} || true

# ホットリロードのためにair導入
RUN go install github.com/air-verse/air@latest

# 依存関係の整理・不要な依存関係の追加と削除を行う
RUN go mod tidy

# air を実行するための CMD
CMD ["air", "-c", "../../../.air.toml"]