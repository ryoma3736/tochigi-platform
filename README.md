# 栃木プラットフォーム（Tochigi Platform）

## プロジェクト概要

栃木プラットフォームは、栃木県の地域企業向けのオンライン総合プラットフォームです。企業がInstagramと連携し、サービスを掲載して顧客からの問い合わせを受け取ることができます。

### 主な機能

- **企業登録・管理**: カテゴリー別の企業情報管理
- **サービス掲載**: 価格帯付きサービス情報の管理
- **Instagram連携**: Instagram Graph APIでの投稿自動取得
- **問い合わせ管理**: 一括見積もり問い合わせシステム
- **サブスクリプション管理**: Stripe連携による決済システム
- **メール通知**: SendGridによる自動メール送信

## 技術スタック

### フロントエンド
- **Next.js 16** - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント
- **React Hook Form** - フォーム管理
- **Zod** - バリデーション

### バックエンド
- **Next.js API Routes** - サーバーレスAPI
- **Prisma** - ORMとデータベース管理
- **PostgreSQL** - リレーショナルデータベース

### 外部サービス連携
- **Stripe** - 決済・サブスクリプション管理
- **Instagram Graph API** - Instagram投稿取得
- **SendGrid** - メール配信サービス

## 開発環境のセットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- PostgreSQL 14以上（ローカル開発の場合）
- Docker & Docker Compose（推奨）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd tochigi-platform
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な環境変数を設定してください。詳細は下記の「環境変数の説明」を参照してください。

### 4. データベースのセットアップ

#### Docker Composeを使用する場合（推奨）

```bash
# PostgreSQLコンテナを起動
docker-compose up -d

# データベーススキーマを作成
npm run db:push

# または、マイグレーションを実行
npm run db:migrate
```

#### ローカルPostgreSQLを使用する場合

1. PostgreSQLをインストール
2. データベースを作成
```sql
CREATE DATABASE tochigi_platform;
```
3. `.env`の`DATABASE_URL`を更新
4. Prismaスキーマを適用
```bash
npm run db:push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアクセスできます。

## 環境変数の説明

### 必須環境変数

#### データベース
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/tochigi_platform"
```
PostgreSQLデータベースへの接続文字列です。フォーマット：
- `user`: データベースユーザー名
- `password`: データベースパスワード
- `localhost:5432`: ホストとポート
- `tochigi_platform`: データベース名

#### アプリケーションURL
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
アプリケーションのベースURL。本番環境では実際のドメインに設定します。

#### Instagram Graph API
```bash
INSTAGRAM_CLIENT_ID="your_instagram_client_id"
INSTAGRAM_CLIENT_SECRET="your_instagram_client_secret"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/api/instagram/callback"
```

Instagram Graph APIの認証情報です。[Meta for Developers](https://developers.facebook.com/)で取得してください。

**取得手順:**
1. Meta for Developersにアクセス
2. アプリを作成
3. Instagram Graph APIを有効化
4. OAuth設定でリダイレクトURIを追加
5. アプリIDとシークレットを取得

#### Stripe決済
```bash
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

Stripe決済システムの認証情報です。[Stripe Dashboard](https://dashboard.stripe.com/)で取得してください。

**取得手順:**
1. Stripeアカウントを作成
2. APIキーを取得（テストモード推奨）
3. Webhookエンドポイントを設定：`https://yourdomain.com/api/webhooks/stripe`
4. Webhook署名シークレットを取得

#### Stripe商品価格ID
```bash
STRIPE_PRICE_INSTAGRAM_ONLY="price_instagram_only_id"
STRIPE_PRICE_PLATFORM_FULL="price_platform_full_id"
```

Stripeで作成した商品の価格IDです。

**設定手順:**
1. Stripe Dashboardで「商品」を作成
2. 「Instagramのみ」プラン（例：月額5,000円）
3. 「フルプラットフォーム」プラン（例：月額10,000円）
4. 各価格IDをコピーして設定

#### SendGridメール
```bash
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@tochigi-platform.com"
```

SendGridメール配信サービスの認証情報です。[SendGrid](https://sendgrid.com/)で取得してください。

**取得手順:**
1. SendGridアカウントを作成
2. APIキーを生成（Full Access推奨）
3. 送信元メールアドレスを認証

#### Cronジョブセキュリティ
```bash
CRON_SECRET="your_secure_random_string_for_cron_jobs"
```

定期実行ジョブのセキュリティトークンです。ランダムな文字列を生成してください。

```bash
# 生成例
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### オプション環境変数

```bash
NODE_ENV="development"  # development | production | test
```

## NPMスクリプト

### 開発
```bash
npm run dev          # 開発サーバー起動（ホットリロード有効）
npm run build        # 本番ビルド
npm start            # 本番サーバー起動
npm run lint         # ESLint実行
```

### データベース
```bash
npm run db:generate  # Prisma Clientを生成
npm run db:push      # スキーマをデータベースに同期（開発用）
npm run db:migrate   # マイグレーション実行（本番用）
npm run db:studio    # Prisma Studio起動（GUIツール）
npm run db:seed      # シードデータ投入
```

### テスト
```bash
npm test             # テスト実行
```

## プロジェクト構造

```
tochigi-platform/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # ダッシュボードグループ
│   ├── api/                  # API Routes
│   │   ├── companies/        # 企業関連API
│   │   ├── instagram/        # Instagram連携API
│   │   ├── inquiries/        # 問い合わせAPI
│   │   ├── webhooks/         # Webhook エンドポイント
│   │   └── cron/             # Cronジョブエンドポイント
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # トップページ
├── components/               # Reactコンポーネント
│   ├── ui/                   # 共通UIコンポーネント
│   ├── forms/                # フォームコンポーネント
│   └── layouts/              # レイアウトコンポーネント
├── lib/                      # ユーティリティとヘルパー
│   ├── prisma.ts             # Prismaクライアント
│   ├── stripe.ts             # Stripe設定
│   ├── sendgrid.ts           # SendGrid設定
│   ├── instagram.ts          # Instagram API
│   └── utils.ts              # 汎用ユーティリティ
├── prisma/                   # Prismaスキーマとマイグレーション
│   ├── schema.prisma         # データベーススキーマ
│   ├── migrations/           # マイグレーションファイル
│   └── seed.ts               # シードデータ
├── public/                   # 静的ファイル
├── .env                      # 環境変数（Git管理外）
├── .env.example              # 環境変数テンプレート
├── docker-compose.yml        # Docker設定
├── next.config.js            # Next.js設定
├── package.json              # パッケージ情報
├── tailwind.config.ts        # Tailwind CSS設定
├── tsconfig.json             # TypeScript設定
└── vercel.json               # Vercel設定
```

## API エンドポイント

詳細なAPIドキュメントは [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) を参照してください。

### 主要なエンドポイント

- `GET /api/companies` - 企業一覧取得
- `POST /api/companies` - 企業登録
- `GET /api/companies/[id]` - 企業詳細取得
- `PUT /api/companies/[id]` - 企業情報更新
- `GET /api/instagram/auth` - Instagram認証開始
- `GET /api/instagram/callback` - Instagram認証コールバック
- `POST /api/inquiries` - 問い合わせ送信
- `POST /api/webhooks/stripe` - Stripe Webhook

## データベーススキーマ

Prismaスキーマファイル: `prisma/schema.prisma`

### 主要モデル

- **Category**: カテゴリー
- **Company**: 企業情報
- **Service**: サービス情報
- **Inquiry**: 問い合わせ
- **InquiryCompany**: 問い合わせと企業の関連
- **Subscription**: サブスクリプション情報
- **InstagramPost**: Instagram投稿

## デプロイ

デプロイの詳細手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com)にログイン
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ実行

### 環境変数の設定

Vercelのダッシュボードで以下の環境変数を設定してください：
- すべての`.env.example`に記載されている変数
- `DATABASE_URL`: 本番用データベースURL（Supabase、Neon等を推奨）
- `NEXT_PUBLIC_APP_URL`: 本番ドメイン
- `INSTAGRAM_REDIRECT_URI`: 本番のコールバックURL
- その他すべての環境変数

## Cronジョブの設定

Instagram投稿を自動取得するために、Cronジョブを設定します。

### Vercel Cronを使用する場合

`vercel.json`にCron設定が含まれています：

```json
{
  "crons": [
    {
      "path": "/api/cron/instagram-sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

このジョブは6時間ごとに実行され、Instagram投稿を同期します。

### 外部Cronサービスを使用する場合

[Cron-job.org](https://cron-job.org/)や[EasyCron](https://www.easycron.com/)等のサービスで以下のURLを定期実行：

```
https://yourdomain.com/api/cron/instagram-sync?secret=YOUR_CRON_SECRET
```

## トラブルシューティング

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

**解決方法:**
1. PostgreSQLが起動していることを確認
2. `DATABASE_URL`が正しいか確認
3. ファイアウォール設定を確認

### Prisma Client エラー

```
Error: @prisma/client did not initialize yet
```

**解決方法:**
```bash
npm run db:generate
```

### Instagram API エラー

```
Error: Invalid OAuth access token
```

**解決方法:**
1. Instagram認証トークンを再取得
2. アプリの権限設定を確認（`instagram_basic`, `instagram_manage_insights`）
3. トークンの有効期限を確認（60日）

### Stripe Webhook エラー

**解決方法:**
1. Webhook署名シークレットが正しいか確認
2. Webhookエンドポイントが正しく設定されているか確認
3. Stripeダッシュボードでイベント配信ログを確認

## セキュリティ

### 環境変数の管理

- `.env`ファイルは絶対にGitにコミットしないでください
- `.gitignore`に`.env`が含まれていることを確認
- 本番環境では必ず強力なパスワードとシークレットを使用

### APIエンドポイントの保護

- Cronジョブは`CRON_SECRET`で保護されています
- Webhook署名を必ず検証してください
- 認証が必要なエンドポイントには適切な認証を実装

## ライセンス

このプロジェクトのライセンスは未定です。

## サポート

問題が発生した場合は、以下を確認してください：

1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API仕様
2. [DEPLOYMENT.md](./DEPLOYMENT.md) - デプロイガイド
3. [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - 実装ガイド

## コントリビューション

プロジェクトへの貢献を歓迎します。Pull Requestを送る前に、以下を確認してください：

1. コードが`npm run lint`を通過すること
2. 適切なコミットメッセージを使用すること
3. 変更内容を説明するドキュメントを更新すること

## 更新履歴

### v1.0.0 (2025-11-17)
- 初回リリース
- 企業登録・管理機能
- Instagram連携機能
- 問い合わせ管理機能
- サブスクリプション管理機能
