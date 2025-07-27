# BFF (GraphQL/NestJS) 実装・利用ガイド

## 概要
このプロジェクトはGo backend APIとNext.js frontendの間にGraphQL BFFを配置し、API集約・認証・データ整形を担います。

## 構成
- BFF: `typescript/apps/graphql`
- Backend: `golang/services/hidden_waza`
- Frontend: `typescript/apps/nextjs/projects/work/proof`

## 主なGraphQLスキーマ
- User, Resume, Skill, OS, Tool, Language
- Query: `languages`, `osList`, `tools`, `resumes`, `skills`, `me`
- Mutation: `login`, `register`, `createResume`, `updateResume`, `deleteResume`

## BFFのAPIエンドポイント例
- `POST /graphql` (NestJS GraphQLサーバ)

## BFF→Backend APIマッピング例
- `Query.languages` → `GET /api/v1/languages`
- `Mutation.login` → `POST /api/v1/login`
- `Mutation.register` → `POST /api/v1/signup`
- `Query.resumes` → `GET /api/v1/resumes`
- `Mutation.createResume` → `POST /api/v1/resumes`

## フロントエンド利用例
`components/api/api.ts`をimportし、`authApi.login`, `resumeApi.getResumes`等を呼び出してください。

## 環境変数例
- BFF: `BACKEND_API_URL=http://localhost:8080/api/v1`
- Frontend: `NEXT_PUBLIC_BFF_URL=http://localhost:3001/graphql`

## 起動方法
1. Go backend起動
2. BFF (NestJS) 起動
3. Frontend (Next.js) 起動

## 注意
- スキーマやAPIエンドポイントは今後拡張される場合があります。
- 詳細は各resolver, service, frontendのapi.tsを参照してください。
