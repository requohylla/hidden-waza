# 将来的にはpnpmに置き換えたい

# 202503時点最新LTSの22を使用。 @latestは壊れる原因になるから使わない
FROM node:22.14.0

# 作業するベースディレクトリを指定。存在しないパスを指定した場合は新規で作成されます。
WORKDIR /app

# 依存関係ファイルをコピー
# docker レイヤー キャッシュ(DLC)の観点から変更が少ないものに関しては個別にCOPYした方が良い
COPY package.json package-lock.json ./

# 依存関係を厳密にインストール（npm ci推奨）
RUN npm ci

# ビルドコンテキストに指定したディレクトリをコンテナのワーキングディレクトリにコピー
# レイヤーキャッシュを活用したいファイルはdockerignoreで除外しないとここで二重コピーになって効率悪い
COPY . .

RUN npm run build

CMD ["npm", "start"]
