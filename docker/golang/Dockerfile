#* ビルドステージ *#

# イメージとバージョンの指定。latestにすると予期しないバグが発生するので注意
FROM golang:1.23.6 AS builder

# docker-compose.ymlのargsから取得した環境変数
ARG APP_NAME

# 作業するベースディレクトリを指定。存在しないパスを指定した場合は新規で作成されます。
WORKDIR /app

# ビルドコンテキストに指定したディレクトリのファイルをコンテナのワーキングディレクトリにコピー
COPY go.mod go.sum vendor .

# キャッシュの最適化のためにソースコードは別でコピー
# レキャッシュを活用したいファイルはdockerignoreで除外しないとここで二重コピーになって効率悪い
COPY . .

# ビルド前にmain.goがあるディレクトリに移動
WORKDIR /app/services/${APP_NAME}

# 依存関係の整理・不要な依存関係の追加と削除を行う
# ビルドする
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o main

#* 実行ステージ *#
# Distrolessにはアプリケーションの実行に必要な依存しか含まれていないので軽量でセキュア(Shell、apt、cd等が使えない)
# そのような性質からワンバイナリで動くGolangとは相性が良い(他の言語ではslimとかbusybox使ったほうがいいかも)
# セキュリティとファイル所有権の観点からnon rootユーザーで実行
FROM gcr.io/distroless/static:nonroot

ARG APP_NAME

# ビルドステージから必要なファイルのみコピー
COPY --from=builder --chown=nonroot:nonroot /app/services/${APP_NAME}/main /

CMD ["/main"]
