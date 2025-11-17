# デプロイメントガイド

このドキュメントでは、栃木プラットフォームを本番環境にデプロイする手順を説明します。

## 目次

1. [デプロイ前の準備](#デプロイ前の準備)
2. [Vercelへのデプロイ](#vercelへのデプロイ)
3. [データベースのセットアップ](#データベースのセットアップ)
4. [環境変数の設定](#環境変数の設定)
5. [外部サービスの設定](#外部サービスの設定)
6. [Cronジョブの設定](#cronジョブの設定)
7. [デプロイ後の確認](#デプロイ後の確認)
8. [トラブルシューティング](#トラブルシューティング)

## デプロイ前の準備

### 1. 必要なアカウントの作成

デプロイには以下のサービスアカウントが必要です：

- [Vercel](https://vercel.com/) - ホスティングプラットフォーム
- [Supabase](https://supabase.com/) または [Neon](https://neon.tech/) - PostgreSQLデータベース
- [Stripe](https://stripe.com/) - 決済システム
- [SendGrid](https://sendgrid.com/) - メール配信サービス
- [Meta for Developers](https://developers.facebook.com/) - Instagram API

### 2. リポジトリの準備

GitHubリポジトリにコードをプッシュします：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repository-url>
git push -u origin main
```

### 3. ビルドテスト

ローカルで本番ビルドをテストします：

```bash
npm run build
npm start
```

エラーがないことを確認してください。

## Vercelへのデプロイ

### ステップ1: Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New" → "Project"をクリック
3. GitHubリポジトリをインポート
4. プロジェクト名を設定（例: `tochigi-platform`）

### ステップ2: ビルド設定

Vercelは自動的にNext.jsプロジェクトを検出しますが、以下を確認してください：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` または `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### ステップ3: 環境変数の設定（一時的）

初回デプロイ前に、最低限の環境変数を設定：

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

他の環境変数は後で設定します。

### ステップ4: デプロイ

"Deploy"ボタンをクリックしてデプロイを開始します。

初回デプロイは5-10分程度かかる場合があります。

## データベースのセットアップ

### オプション1: Supabaseを使用（推奨）

#### 1. Supabaseプロジェクトの作成

1. [Supabase Dashboard](https://app.supabase.com/)にアクセス
2. "New project"をクリック
3. プロジェクト情報を入力：
   - Name: `tochigi-platform`
   - Database Password: 強力なパスワードを設定（保存してください）
   - Region: `Northeast Asia (Tokyo)` を推奨
4. "Create new project"をクリック

#### 2. 接続情報の取得

1. Project Settings → Database → Connection stringに移動
2. "URI"タブを選択
3. 接続文字列をコピー（`[YOUR-PASSWORD]`を実際のパスワードに置き換え）

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

#### 3. 接続プーリングの設定（推奨）

Vercelのサーバーレス環境では接続プーリングが推奨されます：

1. Project Settings → Database → Connection poolingに移動
2. "Transaction"モードを選択
3. 接続文字列をコピー

```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### オプション2: Neonを使用

#### 1. Neonプロジェクトの作成

1. [Neon Console](https://console.neon.tech/)にアクセス
2. "Create a project"をクリック
3. プロジェクト名を入力: `tochigi-platform`
4. Region: `Asia Pacific (Tokyo)`を選択
5. "Create project"をクリック

#### 2. 接続情報の取得

ダッシュボードから接続文字列をコピー：

```
postgresql://user:password@ep-xxx.ap-northeast-1.aws.neon.tech/neondb?sslmode=require
```

### データベーススキーマの適用

#### 1. ローカルで接続確認

`.env`ファイルに本番データベースのURLを一時的に設定：

```bash
DATABASE_URL="<production-database-url>"
```

#### 2. Prismaマイグレーション実行

```bash
# スキーマを適用
npx prisma db push

# または、マイグレーションを実行
npx prisma migrate deploy
```

#### 3. Prisma Clientの生成

```bash
npx prisma generate
```

#### 4. 初期データの投入（オプション）

```bash
npm run db:seed
```

シードファイル（`prisma/seed.ts`）にカテゴリーなどの初期データを定義してください。

## 環境変数の設定

### Vercelダッシュボードでの設定

1. Vercelプロジェクトのダッシュボードにアクセス
2. Settings → Environment Variablesに移動
3. 以下の環境変数を追加

### 必須環境変数一覧

#### データベース

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

または接続プーリング使用時：

```bash
DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

#### アプリケーションURL

```bash
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

Vercelが割り当てたドメインまたはカスタムドメインを設定してください。

#### NextAuth（認証）

```bash
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="<generate-random-secret>"
```

シークレットの生成：

```bash
openssl rand -base64 32
```

#### Instagram Graph API

```bash
INSTAGRAM_CLIENT_ID="your_instagram_client_id"
INSTAGRAM_CLIENT_SECRET="your_instagram_client_secret"
INSTAGRAM_REDIRECT_URI="https://your-domain.vercel.app/api/instagram/callback"
```

#### Stripe

```bash
# 本番環境では本番キーを使用
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# 商品価格ID（Stripeで作成）
STRIPE_PRICE_INSTAGRAM_ONLY="price_xxx"
STRIPE_PRICE_PLATFORM_FULL="price_xxx"
```

#### SendGrid

```bash
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@your-domain.com"
```

#### Cronジョブセキュリティ

```bash
CRON_SECRET="<generate-random-secret>"
```

生成例：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Node環境

```bash
NODE_ENV="production"
```

### 環境変数の適用範囲

各環境変数を適用する環境を選択：

- **Production**: 本番環境
- **Preview**: プレビュー環境（PR時）
- **Development**: 開発環境（通常は不要）

通常、すべての環境変数を"Production"と"Preview"に設定します。

## 外部サービスの設定

### 1. Stripe設定

#### 商品と価格の作成

1. [Stripe Dashboard](https://dashboard.stripe.com/)にログイン
2. Products → Add productをクリック

**Instagram連携プラン**
- Name: Instagram連携プラン
- Description: Instagram投稿の自動取得・表示
- Pricing: Recurring, Monthly
- Price: ¥5,000/月
- Price IDをコピーして`STRIPE_PRICE_INSTAGRAM_ONLY`に設定

**フルプラットフォームプラン**
- Name: フルプラットフォームプラン
- Description: Instagram連携 + サービス掲載 + 問い合わせ管理
- Pricing: Recurring, Monthly
- Price: ¥10,000/月
- Price IDをコピーして`STRIPE_PRICE_PLATFORM_FULL`に設定

#### Webhookエンドポイントの設定

1. Developers → Webhooksに移動
2. "Add endpoint"をクリック
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Listen to events: 以下のイベントを選択
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. "Add endpoint"をクリック
6. Signing secretをコピーして`STRIPE_WEBHOOK_SECRET`に設定

#### テストモードから本番モードへの移行

開発時はテストモードを使用し、本番リリース時に以下を実施：

1. Stripeダッシュボードでライブモードに切り替え
2. 本番APIキーを取得
3. Vercelの環境変数を本番キーに更新
4. Webhookエンドポイントを本番モードで再作成

### 2. Instagram Graph API設定

#### アプリの作成

1. [Meta for Developers](https://developers.facebook.com/)にアクセス
2. "My Apps" → "Create App"をクリック
3. Use case: "Other"を選択
4. App type: "Business"を選択
5. App nameを入力（例：Tochigi Platform）
6. App contact emailを入力

#### Instagram Graph APIの有効化

1. Dashboard → Add productから"Instagram"を追加
2. Instagram Graph APIを選択
3. Settingsで以下を設定：
   - Valid OAuth Redirect URIs: `https://your-domain.vercel.app/api/instagram/callback`
   - Deauthorize Callback URL: `https://your-domain.vercel.app/api/instagram/deauthorize`
   - Data Deletion Request URL: `https://your-domain.vercel.app/api/instagram/deletion`

#### App Review

本番環境で使用するには、以下の権限をApp Reviewで承認申請する必要があります：

- `instagram_basic`
- `instagram_manage_insights` (オプション)
- `pages_read_engagement` (オプション)

#### クライアントIDとシークレットの取得

1. Settings → Basicに移動
2. App IDをコピー → `INSTAGRAM_CLIENT_ID`
3. App Secretを表示してコピー → `INSTAGRAM_CLIENT_SECRET`

### 3. SendGrid設定

#### APIキーの作成

1. [SendGrid Dashboard](https://app.sendgrid.com/)にログイン
2. Settings → API Keysに移動
3. "Create API Key"をクリック
4. API Key Name: `tochigi-platform-production`
5. API Key Permissions: "Full Access"を選択
6. APIキーをコピー → `SENDGRID_API_KEY`（一度しか表示されないので注意）

#### 送信元メールアドレスの認証

1. Settings → Sender Authenticationに移動
2. "Verify a Single Sender"をクリック
3. 送信元情報を入力：
   - From Name: 栃木プラットフォーム
   - From Email Address: noreply@your-domain.com
   - Reply To: support@your-domain.com
4. 確認メールをチェックして認証完了

#### ドメイン認証（推奨）

より高い配信率のため、ドメイン認証を設定：

1. Settings → Sender Authenticationに移動
2. "Authenticate Your Domain"をクリック
3. ドメインプロバイダーを選択
4. DNS設定手順に従ってCNAMEレコードを追加
5. 認証が完了するまで待機（通常48時間以内）

## Cronジョブの設定

Instagram投稿を定期的に同期するため、Cronジョブを設定します。

### オプション1: Vercel Cronを使用（推奨）

Vercelの有料プラン（Pro以上）が必要です。

#### vercel.jsonの確認

プロジェクトルートの`vercel.json`に以下が含まれていることを確認：

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

これにより、6時間ごとにInstagram投稿が同期されます。

#### Cronジョブの動作確認

1. Vercelダッシュボード → Crons タブ
2. ジョブが表示されていることを確認
3. 手動実行でテスト可能

### オプション2: 外部Cronサービスを使用（無料プラン）

Vercel無料プランの場合、外部Cronサービスを使用します。

#### Cron-job.orgを使用

1. [Cron-job.org](https://cron-job.org/)にアカウント作成
2. "Create cronjob"をクリック
3. 設定：
   - Title: `Instagram Sync - Tochigi Platform`
   - URL: `https://your-domain.vercel.app/api/cron/instagram-sync?secret=YOUR_CRON_SECRET`
   - Schedule: Every 6 hours（`0 */6 * * *`）
   - Notification: On failure
4. "Create"をクリック

#### EasyCronを使用

1. [EasyCron](https://www.easycron.com/)にアカウント作成
2. "Add New Cron Job"をクリック
3. 設定：
   - URL: `https://your-domain.vercel.app/api/cron/instagram-sync?secret=YOUR_CRON_SECRET`
   - Cron Expression: `0 */6 * * *`
   - Name: `Instagram Sync`
4. "Create"をクリック

## デプロイ後の確認

### 1. アプリケーションの動作確認

1. Vercelが割り当てたURLにアクセス
2. トップページが表示されることを確認
3. 各ページへのナビゲーションが正常に動作することを確認

### 2. データベース接続確認

1. 企業登録ページにアクセス
2. テスト企業を登録
3. Prisma Studioまたはデータベースクライアントでデータを確認

```bash
# ローカルから本番DBに接続
DATABASE_URL="<production-url>" npx prisma studio
```

### 3. Instagram連携テスト

1. 企業ダッシュボードにログイン
2. Instagram連携ボタンをクリック
3. 認証フローが正常に動作することを確認
4. 投稿が取得されることを確認

### 4. Stripe決済テスト

#### テストモードでの確認

1. サブスクリプション登録ページにアクセス
2. Stripeのテストカード番号を使用：
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: 将来の任意の日付
   - CVC: 任意の3桁
   - 郵便番号: 任意
3. 決済が成功することを確認
4. Stripeダッシュボードで支払いを確認

### 5. メール送信テスト

1. 問い合わせフォームから送信
2. SendGridダッシュボードでメール送信を確認
3. 受信メールを確認

### 6. Cronジョブテスト

1. Cronジョブのエンドポイントに手動アクセス：

```bash
curl "https://your-domain.vercel.app/api/cron/instagram-sync?secret=YOUR_CRON_SECRET"
```

2. レスポンスを確認
3. データベースで投稿が更新されたことを確認

## トラブルシューティング

### デプロイエラー

#### ビルドエラー: "Module not found"

**原因**: 依存パッケージがインストールされていない

**解決方法**:
```bash
# package-lock.jsonを削除して再インストール
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### ビルドエラー: "Type error"

**原因**: TypeScriptの型エラー

**解決方法**:
```bash
# ローカルで型チェック
npm run build

# エラーを修正してプッシュ
```

### データベース接続エラー

#### Error: P1001 - Can't reach database

**原因**:
- DATABASE_URLが間違っている
- データベースサーバーがダウンしている
- IPアドレス制限

**解決方法**:
1. DATABASE_URLが正しいか確認
2. データベースプロバイダーのダッシュボードでステータス確認
3. Supabaseの場合、すべてのIPアドレスからのアクセスを許可

#### Error: P1017 - Server has closed the connection

**原因**: 接続プーリングが設定されていない

**解決方法**:
- Supabase/Neonの接続プーリングURLを使用
- `?pgbouncer=true`パラメータを追加

### Stripe Webhookエラー

#### 署名検証失敗

**原因**: STRIPE_WEBHOOK_SECRETが間違っている

**解決方法**:
1. Stripeダッシュボード → Webhooks
2. 該当するエンドポイントを選択
3. Signing secretをコピー
4. Vercelの環境変数を更新
5. 再デプロイ

### Instagram API エラー

#### Error: Invalid OAuth Redirect URI

**原因**: リダイレクトURIが登録されていない

**解決方法**:
1. Meta for Developers → Your App → Instagram → Settings
2. Valid OAuth Redirect URIsに追加：
   - `https://your-domain.vercel.app/api/instagram/callback`
3. 変更を保存

#### Error: Token expired

**原因**: アクセストークンの有効期限切れ（60日）

**解決方法**:
- ユーザーに再認証を促す
- Long-lived tokenをRefresh

### メール送信エラー

#### SendGrid 401 Unauthorized

**原因**: APIキーが無効または間違っている

**解決方法**:
1. SendGridで新しいAPIキーを生成
2. Vercelの環境変数を更新
3. 再デプロイ

#### メールが届かない

**原因**:
- 送信元メールアドレスが認証されていない
- スパムフィルターにブロックされている

**解決方法**:
1. SendGridでドメイン認証を完了
2. SPF/DKIMレコードを設定
3. テストメールを送信

## パフォーマンス最適化

### 1. 画像最適化

Next.jsの`next/image`コンポーネントを使用：

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### 2. キャッシュ設定

VercelのEdge Cacheを活用：

```typescript
// app/api/companies/route.ts
export const revalidate = 3600 // 1時間キャッシュ
```

### 3. データベースクエリ最適化

Prismaのインデックスを確認：

```prisma
model Company {
  // ...
  @@index([categoryId])
  @@index([isActive])
}
```

## セキュリティチェックリスト

- [ ] すべての環境変数が設定されている
- [ ] `.env`ファイルが`.gitignore`に含まれている
- [ ] Stripe Webhookの署名検証が有効
- [ ] Cronジョブが`CRON_SECRET`で保護されている
- [ ] データベースが接続プーリングを使用
- [ ] HTTPS接続のみ許可
- [ ] SendGridのドメイン認証完了
- [ ] Instagram APIの権限が最小限
- [ ] 本番APIキーがテストキーと分離されている

## カスタムドメインの設定

### 1. Vercelでドメインを追加

1. Vercelプロジェクト → Settings → Domains
2. "Add"をクリック
3. ドメイン名を入力（例：`tochigi-platform.com`）
4. 指示に従ってDNSレコードを設定

### 2. DNSレコードの設定

ドメインプロバイダー（お名前.com、ムームードメイン等）で設定：

**Aレコード**:
```
@ → 76.76.21.21
```

**CNAMEレコード**:
```
www → cname.vercel-dns.com
```

### 3. SSL証明書

Vercelが自動的にLet's Encrypt証明書を発行します（数分〜数時間）。

### 4. 環境変数の更新

カスタムドメイン設定後、以下を更新：

```bash
NEXT_PUBLIC_APP_URL="https://your-custom-domain.com"
NEXTAUTH_URL="https://your-custom-domain.com"
INSTAGRAM_REDIRECT_URI="https://your-custom-domain.com/api/instagram/callback"
```

## モニタリングとロギング

### Vercel Analytics

1. Vercelプロジェクト → Analytics
2. トラフィック、パフォーマンス、エラーを確認

### Vercel Logs

1. Vercelプロジェクト → Deployments → 最新のデプロイ
2. "Functions"タブでサーバーログを確認

### Sentryの統合（オプション）

エラートラッキングを強化：

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

## まとめ

デプロイが完了したら、以下を確認してください：

1. アプリケーションが正常に動作している
2. すべての外部サービスが連携している
3. Cronジョブが定期実行されている
4. メール送信が正常に動作している
5. 決済フローが正常に動作している
6. モニタリングが設定されている

定期的なメンテナンス：
- 依存パッケージのアップデート
- セキュリティパッチの適用
- パフォーマンスのモニタリング
- ログの確認

問題が発生した場合は、Vercelのログとエラーメッセージを確認してください。
