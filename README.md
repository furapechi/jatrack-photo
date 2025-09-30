# Photo Manager - 写真管理アプリ

Next.jsとSupabaseを使用したモダンな写真管理アプリケーションです。フォルダーを作成して写真を整理できます。

## 機能

- ✨ フォルダーの作成・削除
- 📁 **フォルダーの階層構造**（サブフォルダー対応）
- 🗂️ パンくずリスト（パス表示）
- 📸 写真のアップロード・削除
- 🎥 **動画のアップロード・再生**（大容量対応）
- 📄 **PDFファイルのアップロード・プレビュー**
- 🎨 モダンでレスポンシブなデザイン
- 📱 モバイルファーストUI/UX
- 🌙 ダークモード対応
- 💾 Supabaseによる安全なストレージ
- 🚀 高速なパフォーマンス

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseの設定

#### データベーススキーマの作成

1. [Supabase](https://supabase.com/)にログイン
2. SQL Editorを開く
3. `database-schema.sql` の内容をコピー＆ペースト
4. 実行してテーブルを作成

#### ストレージバケットの作成

1. Supabaseダッシュボード > Storage
2. 新しいバケット「photos」を作成
3. Publicに設定

または、SQL Editorで以下を実行：

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;
```

### 3. 環境変数の設定

`.env.local` ファイルは既に設定済みです。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

### フォルダーの作成

1. ヘッダーの「新しいフォルダー」ボタンをクリック
2. フォルダー名を入力
3. 「作成」をクリック

### 写真のアップロード

1. フォルダーを選択
2. 「写真をアップロード」ボタンをクリック
3. 画像ファイルを選択（複数選択可能）

### 写真の削除

1. 写真にマウスオーバー
2. ゴミ箱アイコンをクリック

### フォルダーの削除

1. フォルダーカードにマウスオーバー
2. ゴミ箱アイコンをクリック
3. 確認ダイアログで確定

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **アイコン**: Lucide React

## プロジェクト構造

```
jatrack-database/
├── app/
│   ├── api/              # APIルート
│   │   ├── folders/      # フォルダー関連API
│   │   └── photos/       # 写真関連API
│   ├── globals.css       # グローバルスタイル
│   ├── layout.tsx        # レイアウト
│   └── page.tsx          # メインページ
├── components/           # UIコンポーネント
│   ├── FolderCard.tsx
│   ├── PhotoCard.tsx
│   └── CreateFolderModal.tsx
├── utils/
│   └── supabase/         # Supabase接続ユーティリティ
│       ├── client.ts     # クライアント側
│       ├── server.ts     # サーバー側
│       └── middleware.ts # ミドルウェア
├── database-schema.sql   # データベーススキーマ
└── package.json
```

## データベーススキーマ

### folders テーブル
- id (UUID, PRIMARY KEY)
- name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### photos テーブル
- id (UUID, PRIMARY KEY)
- folder_id (UUID, FOREIGN KEY)
- file_name (TEXT)
- file_path (TEXT)
- file_size (BIGINT)
- mime_type (TEXT)
- created_at (TIMESTAMP)

## 本番環境へのデプロイ

### Vercel推奨

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel

# 環境変数の設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## ライセンス

MIT

## サポート

問題が発生した場合は、Issuesで報告してください。

# jatrack-photo
