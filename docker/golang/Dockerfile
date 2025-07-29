#* ビルドステージ *#

# イメージとバージョンの指定。latestにすると予期しないバグが発生するので注意
# alpineベースでディスクスペース使用量を削減
FROM golang:1.23.6-alpine AS builder

# docker-compose.ymlのargsから取得した環境変数
ARG APP_NAME

# 必要なパッケージをインストール
RUN apk add --no-cache git ca-certificates

# 作業するベースディレクトリを指定。存在しないパスを指定した場合は新規で作成されます。
WORKDIR /app

# ビルドコンテキストに指定したディレクトリのファイルをコンテナのワーキングディレクトリにコピー
# 依存関係ファイルを最初にコピー（キャッシュ効率化）
COPY go.mod go.sum ./

# 依存関係のダウンロード（ソースコードコピー前に実行でキャッシュ効率向上）
RUN go mod download

# gooseのインストール（依存関係ダウンロード後に実行）
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# キャッシュの最適化のためにソースコードは別でコピー
# レキャッシュを活用したいファイルはdockerignoreで除外しないとここで二重コピーになって効率悪い
COPY . .

# ビルド前にmain.goがあるディレクトリに移動
WORKDIR /app/services/${APP_NAME}/cmd/hidden_waza

# 依存関係の整理・ビルド（静的リンクで軽量化）
RUN go mod tidy && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o main

# seederのビルド
WORKDIR /app/services/${APP_NAME}/db/seeder/cmd/seeder
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o seeder

# ビルド後の不要ファイル削除でディスクスペース節約
RUN rm -rf /go/pkg/* /root/.cache/go-build/*

#* 実行ステージ *#
# Distrolessにはアプリケーションの実行に必要な依存しか含まれていないので軽量でセキュア(Shell、apt、cd等が使えない)
# そのような性質からワンバイナリで動くGolangとは相性が良い(他の言語ではslimとかbusybox使ったほうがいいかも)
# セキュリティとファイル所有権の観点からnon rootユーザーで実行
FROM gcr.io/distroless/static:nonroot

ARG APP_NAME

# ビルドステージから必要なファイルのみコピー
COPY --from=builder --chown=nonroot:nonroot /app/services/${APP_NAME}/cmd/hidden_waza/main /
COPY --from=builder --chown=nonroot:nonroot /go/bin/goose /goose
COPY --from=builder --chown=nonroot:nonroot /app/services/${APP_NAME}/db/seeder/cmd/seeder/seeder /seeder
COPY --from=builder --chown=nonroot:nonroot /app/services/${APP_NAME}/db/migrations /migrations
COPY --from=builder --chown=nonroot:nonroot --chmod=755 /app/deploy/entrypoint.prod.sh /entrypoint.prod.sh

USER nonroot

ENTRYPOINT ["/entrypoint.prod.sh"]
