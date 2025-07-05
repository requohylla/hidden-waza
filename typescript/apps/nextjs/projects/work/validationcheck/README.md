# ValidationCheck

リアルタイムに入力フォームのバリデーション（検証）を行い、即時にエラーメッセージやボタンの有効／無効を示すデモプロジェクトです。

---

## 概要

- ユーザーがメールアドレスとパスワードを入力すると、その場で  
  - メールアドレス形式のチェック  
  - パスワードの長さチェック（8文字以上）  
  - パスワードに大文字・数字を含むかのチェック  
- エラーがあればフィールド下にメッセージ表示  
- エラーがなくなると「送信」ボタンが有効化  

---

## デモ画面イメージ

![ValidationCheck デモ](./screenshot.png)

---

## インストール

```bash
git clone https://github.com/yourname/validationcheck.git
cd validationcheck
npm install
npm run dev
