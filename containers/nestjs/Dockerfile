# 将来的にはpnpmに置き換えたい

# 202503時点最新LTSの22を使用。 @latestは壊れる原因になるから使わない
FROM node:22.14.0

# docker-compose.ymlのargsから取得した環境変数
ARG APP_NAME

# 作業するベースディレクトリを指定。存在しないパスを指定した場合は新規で作成されます。
WORKDIR /${APP_NAME}/typescript/apps/graphql

# 依存関係ファイルをコピー
# docker レイヤー キャッシュ(DLC)の観点から変更が少ないものに関しては個別にCOPYした方が良い
COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

# ビルドコンテキストに指定したディレクトリをコンテナのワーキングディレクトリにコピー
COPY . .

# RUN npm run build

CMD ["npm", "start"]

