# TechShare 要件定義メモ

## 1. 機能一覧

- 記事を一覧で見る。
- 記事の詳細を表示する。
- 新しい記事を投稿する。
- 投稿した記事を編集する。
- 記事を削除する。
- 記事をタイトルや本文から検索する。

## 2. 記事のデータ項目

- id：記事を一意に識別するためのID（文字列）
- title：記事のタイトル（文字列）
- content：記事の本文・Markdown形式（文字列）
- author：投稿者名（文字列）
- createdAt：記事の作成日・YYYY-MM-DD形式（文字列）

## 3. APIエンドポイント案

- GET /articles → 記事一覧を取得
- GET /articles/:id → 指定した記事の詳細を取得
- POST /articles → 新しい記事を投稿
- PATCH /articles/:id → 指定した記事を編集
- DELETE /articles/:id → 指定した記事を削除
