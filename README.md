# Claude Hackathon Project

Next.js + Convex を使用したマッチングアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 15.5.2, React 19, TypeScript
- **バックエンド**: Convex
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Lucide React, Framer Motion
- **開発ツール**: ESLint, Prettier

## セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd claudehackathn
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
# .env.local ファイルを作成し、Convexの設定を追加
```

4. Convexをセットアップ
```bash
npx convex dev
```

5. 開発サーバーを起動
```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で利用できます。

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動（Next.js + Convex）
- `npm run dev:next` - Next.jsの開発サーバーのみを起動
- `npm run dev:convex` - Convexの開発サーバーのみを起動
- `npm run build` - プロダクション用にビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - ESLintでコードをチェック

## プロジェクト構造

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # ルートレイアウト
│   │   └── page.tsx        # ホームページ
│   └── lib/                # ユーティリティ関数
├── convex/                 # Convexバックエンド
│   ├── _generated/         # 自動生成ファイル
│   └── schema.ts           # データベーススキーマ
├── public/                 # 静的ファイル
└── specs/                  # プロジェクト仕様書
    └── matching-app/       # マッチングアプリの仕様
```

## 開発

### データベーススキーマの変更

Convexのスキーマを変更した後は、以下のコマンドでマイグレーションを実行してください：

```bash
npx convex dev
```

### デプロイ

1. Convexにデプロイ
```bash
npx convex deploy
```

2. Vercelにデプロイ
```bash
npm run build
# Vercel CLIまたはWebインターフェースでデプロイ
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。