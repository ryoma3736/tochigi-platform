# Tochigi Platform - Phase 5-8 Implementation Guide

## Overview

このドキュメントはPhase 5-8の実装内容と使用方法を説明します。

## Phase 5: Instagram Graph API連携

### 実装内容

#### 1. Instagram APIラッパー (`lib/instagram.ts`)
- OAuth認証処理
- アクセストークンの交換・更新
- 投稿の取得・公開
- ユーザープロフィール取得

#### 2. Instagram認証API (`app/api/instagram/auth/route.ts`)
- `GET /api/instagram/auth?companyId=xxx` - Instagram認証URLを取得
- `POST /api/instagram/auth` - 認証コードをトークンに交換
- `DELETE /api/instagram/auth?companyId=xxx` - Instagram連携解除

#### 3. Instagram同期API (`app/api/instagram/sync/route.ts`)
- `POST /api/instagram/sync` - Instagram投稿を手動で同期
- 自動的にデータベースに保存
- 完了時にメール通知を送信

#### 4. Instagram投稿取得API (`app/api/instagram/posts/route.ts`)
- `GET /api/instagram/posts?companyId=xxx&limit=12` - 投稿一覧を取得

#### 5. Instagram投稿スケジューラー (`app/api/instagram/schedule/route.ts`)
- `POST /api/instagram/schedule` - 投稿をスケジュール
- `GET /api/instagram/schedule?companyId=xxx` - スケジュール一覧
- `DELETE /api/instagram/schedule?postId=xxx` - スケジュール削除

#### 6. Instagram投稿公開API (`app/api/instagram/publish/route.ts`)
- `POST /api/instagram/publish` - 即座にInstagramに投稿

#### 7. Cron Job (`app/api/cron/instagram-sync/route.ts`)
- `GET /api/cron/instagram-sync` - 全業者のInstagram投稿を自動同期
- 6時間ごとの実行を推奨
- `Authorization: Bearer CRON_SECRET` ヘッダーで認証

### 使用方法

1. Instagram App作成:
   - https://developers.facebook.com/ でアプリを作成
   - Instagram Graph APIを有効化
   - クライアントIDとシークレットを取得

2. 環境変数設定:
```env
INSTAGRAM_CLIENT_ID="your_client_id"
INSTAGRAM_CLIENT_SECRET="your_client_secret"
INSTAGRAM_REDIRECT_URI="https://yourdomain.com/api/instagram/callback"
```

3. Cronジョブ設定:
   - Vercel Cron、GitHub Actions、または外部Cronサービスを使用
   - `/api/cron/instagram-sync` を定期的に呼び出し

## Phase 6: Stripe決済・サブスクリプション

### 実装内容

#### 1. Stripeクライアント (`lib/stripe.ts`)
- Stripe SDKの初期化
- プラン定義 (Instagram連携: 50,000円、フルプラットフォーム: 120,000円)
- サブスクリプション管理関数

#### 2. サブスクリプション作成API (`app/api/subscription/create/route.ts`)
- `POST /api/subscription/create` - Stripe Checkoutセッション作成

#### 3. プラン変更API (`app/api/subscription/change-plan/route.ts`)
- `POST /api/subscription/change-plan` - サブスクリプションプラン変更

#### 4. サブスクリプション解約API (`app/api/subscription/cancel/route.ts`)
- `POST /api/subscription/cancel` - サブスクリプション解約

#### 5. Stripeウェブフック (`app/api/webhooks/stripe/route.ts`)
- `checkout.session.completed` - 決済完了
- `customer.subscription.created` - サブスクリプション作成
- `customer.subscription.updated` - サブスクリプション更新
- `customer.subscription.deleted` - サブスクリプション削除
- `invoice.payment_succeeded` - 支払い成功
- `invoice.payment_failed` - 支払い失敗

#### 6. サブスクリプション管理ページ (`app/(business)/dashboard/subscription/page.tsx`)
- 現在のプラン表示
- プラン変更
- 解約処理

#### 7. サブスクリプションフォーム (`components/business/SubscriptionForm.tsx`)
- プラン選択UI
- 料金・機能の表示

### 使用方法

1. Stripeアカウント作成:
   - https://stripe.com/ でアカウント作成
   - APIキーを取得

2. Stripe製品・価格作成:
```bash
# Stripe CLIまたはダッシュボードで作成
stripe products create --name "Instagram連携プラン" --description "..."
stripe prices create --product prod_xxx --currency jpy --unit-amount 5000000 --recurring interval=month
```

3. 環境変数設定:
```env
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
STRIPE_PRICE_INSTAGRAM_ONLY="price_xxx"
STRIPE_PRICE_PLATFORM_FULL="price_xxx"
```

4. ウェブフック設定:
   - Stripeダッシュボード > Developers > Webhooks
   - エンドポイント追加: `https://yourdomain.com/api/webhooks/stripe`
   - イベント選択: すべてのサブスクリプションイベント

## Phase 7: メール送信機能

### 実装内容

#### 1. メール送信ライブラリ (`lib/email.ts`)
- SendGrid統合
- 単一メール送信
- バルクメール送信
- バリデーション

#### 2. メールテンプレート (`lib/email-templates.ts`)
- 問い合わせ通知 (業者向け)
- 問い合わせ確認 (顧客向け)
- サブスクリプション開始
- サブスクリプション解約
- 支払い失敗通知
- Instagram同期成功・エラー通知

#### 3. 問い合わせAPI更新 (`app/api/inquiries/route.ts`)
- 問い合わせ送信時に自動メール送信
- 業者と顧客の両方に通知

### 使用方法

1. SendGridアカウント作成:
   - https://sendgrid.com/ でアカウント作成
   - APIキーを作成

2. 送信者ドメイン認証:
   - SendGridダッシュボード > Settings > Sender Authentication
   - ドメイン認証を完了

3. 環境変数設定:
```env
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

## Phase 8: 管理者ダッシュボード

### 実装内容

#### 1. 管理者レイアウト (`app/admin/layout.tsx`)
- 管理者用ナビゲーション
- 統一されたレイアウト

#### 2. 統計ダッシュボード (`app/admin/page.tsx`)
- プラットフォーム全体の統計
- 登録業者数、問い合わせ数
- 売上情報、プラン別契約数

#### 3. 業者管理ページ (`app/admin/companies/page.tsx`)
- 全業者の一覧表示
- ステータスフィルタリング
- 業者の有効化/無効化

#### 4. 売上レポートページ (`app/admin/revenue/page.tsx`)
- 総売上・月次売上
- プラン別売上分析
- 月次推移グラフ
- 最近の取引履歴

#### 5. 管理者API

**統計API (`app/api/admin/stats/route.ts`)**
- `GET /api/admin/stats` - プラットフォーム全体の統計

**業者管理API (`app/api/admin/companies/route.ts`)**
- `GET /api/admin/companies` - 全業者一覧
- `PATCH /api/admin/companies` - 業者ステータス更新
- `DELETE /api/admin/companies?id=xxx` - 業者削除

**売上API (`app/api/admin/revenue/route.ts`)**
- `GET /api/admin/revenue` - 売上レポート取得

#### 6. UIコンポーネント

**StatCard (`components/admin/StatCard.tsx`)**
- 統計カード表示

**RevenueChart (`components/admin/RevenueChart.tsx`)**
- 売上グラフ表示
- データテーブル

### 使用方法

1. 管理者ダッシュボードにアクセス:
   - `http://localhost:3000/admin` - 統計ダッシュボード
   - `http://localhost:3000/admin/companies` - 業者管理
   - `http://localhost:3000/admin/revenue` - 売上レポート

2. 認証・認可の追加 (推奨):
   - 本番環境では管理者認証を実装してください
   - Next-AuthまたはClerkなどを使用

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
# .envファイルを編集して実際の値を設定
```

### 3. データベースのセットアップ

```bash
npm run db:generate
npm run db:push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. Stripeウェブフックのテスト (ローカル開発)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 本番環境デプロイ

### 1. 環境変数の設定

Vercel/Netlifyなどのホスティングサービスで以下を設定:
- すべての環境変数を本番用の値に変更
- `NEXT_PUBLIC_APP_URL` を本番URLに変更

### 2. データベースのマイグレーション

```bash
npm run db:migrate
```

### 3. Cronジョブの設定

**Vercel Cronの場合:**
`vercel.json` を作成:
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

**GitHub Actionsの場合:**
`.github/workflows/instagram-sync.yml` を作成

### 4. ウェブフックの設定

- Stripeダッシュボードで本番用ウェブフックを設定
- Instagram Appで本番用リダイレクトURIを設定

## トラブルシューティング

### Instagram連携エラー

1. クライアントIDとシークレットが正しいか確認
2. リダイレクトURIが正確に一致しているか確認
3. Instagram Appが本番モードになっているか確認

### Stripe決済エラー

1. APIキーが正しいか確認 (テスト/本番を間違えていないか)
2. 価格IDが正しいか確認
3. ウェブフックシークレットが正しいか確認

### メール送信エラー

1. SendGrid APIキーが有効か確認
2. 送信者メールアドレスが認証済みか確認
3. SendGridのクォータを超えていないか確認

## セキュリティチェックリスト

- [ ] すべての環境変数がセキュアに管理されている
- [ ] 管理者ダッシュボードに認証が実装されている
- [ ] CronジョブがCRON_SECRETで保護されている
- [ ] StripeウェブフックがWEBHOOK_SECRETで検証されている
- [ ] APIエンドポイントにレート制限が設定されている
- [ ] ユーザー入力が適切にバリデーションされている

## 次のステップ

- [ ] 認証・認可システムの実装 (Next-Auth/Clerk)
- [ ] ファイルアップロード機能の追加
- [ ] 画像最適化の実装
- [ ] キャッシュ戦略の実装
- [ ] エラー追跡 (Sentry等)
- [ ] 分析ツール (Google Analytics等)

## サポート

問題が発生した場合は、各サービスの公式ドキュメントを参照してください:

- Instagram Graph API: https://developers.facebook.com/docs/instagram-api
- Stripe: https://stripe.com/docs
- SendGrid: https://docs.sendgrid.com/
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
