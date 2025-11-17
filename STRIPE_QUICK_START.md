# Stripe決済 クイックスタートガイド

## 環境変数設定（必須）

`.env` ファイルに以下を追加:

```bash
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_your_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Stripe Price IDs (Dashboardで作成後)
STRIPE_PRICE_INSTAGRAM_ONLY="price_xxxxx"
STRIPE_PRICE_PLATFORM_FULL="price_xxxxx"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Stripe Dashboard セットアップ

### 1. Productsを作成
1. https://dashboard.stripe.com/test/products にアクセス
2. "Create product" をクリック

**Instagram連携プラン:**
- Name: `Instagram連携プラン`
- Price: `50000` JPY
- Recurring: `Monthly`
- Price IDをコピーして `.env` の `STRIPE_PRICE_INSTAGRAM_ONLY` に貼り付け

**フルプラットフォームプラン:**
- Name: `フルプラットフォームプラン`
- Price: `120000` JPY
- Recurring: `Monthly`
- Price IDをコピーして `.env` の `STRIPE_PRICE_PLATFORM_FULL` に貼り付け

### 2. Webhookを設定
1. https://dashboard.stripe.com/test/webhooks にアクセス
2. "Add endpoint" をクリック
3. Endpoint URL: `http://localhost:3000/api/webhooks/stripe` (本番では https://your-domain.com)
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. "Add endpoint" をクリック
6. Signing secretをコピーして `.env` の `STRIPE_WEBHOOK_SECRET` に貼り付け

## ローカル開発でのWebhookテスト

```bash
# Stripe CLIをインストール
brew install stripe/stripe-cli/stripe

# Stripeにログイン
stripe login

# Webhookをフォワード
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

出力される `whsec_xxxxx` を `.env` の `STRIPE_WEBHOOK_SECRET` に設定

## テスト用カード番号

- 成功: `4242 4242 4242 4242`
- 失敗: `4000 0000 0000 0002`
- 有効期限: 将来の日付 (例: `12/34`)
- CVC: 任意の3桁 (例: `123`)

## 実装されているAPI

### 1. サブスクリプション作成
```bash
POST /api/subscription/create
Content-Type: application/json

{
  "companyId": "company_xxx",
  "planId": "instagram_only" または "platform_full"
}
```

### 2. プラン変更
```bash
POST /api/subscription/change-plan
Content-Type: application/json

{
  "companyId": "company_xxx",
  "newPlanId": "platform_full"
}
```

### 3. キャンセル
```bash
POST /api/subscription/cancel
Content-Type: application/json

{
  "companyId": "company_xxx",
  "immediately": false
}
```

## 使用方法

### ダッシュボードでサブスクリプション管理

1. ブラウザで `/dashboard/subscription` にアクセス
2. プランを選択
3. Stripe Checkoutページで支払い情報を入力
4. 成功するとダッシュボードに戻る

### プラン変更

1. "プラン変更" ボタンをクリック
2. 新しいプランを選択
3. 確認して変更

### キャンセル

1. "解約する" ボタンをクリック
2. 確認ダイアログで確定
3. 次回更新日に自動キャンセル

## トラブルシューティング

### Webhookが動かない
- `stripe listen` が実行中か確認
- Signing secretが正しいか確認
- URLが `http://localhost:3000/api/webhooks/stripe` か確認

### 支払いエラー
- Price IDが正しく設定されているか確認
- テストモードのAPIキーを使用しているか確認
- Stripe Dashboardのログを確認

### TypeScriptエラー
```bash
npm run db:generate
npx tsc --noEmit
```

## 本番環境デプロイ時

1. `.env` のAPIキーを本番用に変更 (`sk_live_xxx`, `pk_live_xxx`)
2. Webhook URLを本番URLに変更 (`https://your-domain.com/api/webhooks/stripe`)
3. 本番モードでProductとPriceを作成
4. 新しいPrice IDを環境変数に設定
5. Webhook signing secretを更新

---

詳細なドキュメントは `PHASE_6_STRIPE_IMPLEMENTATION_COMPLETE.md` を参照してください。
