# Phase 6: Stripe決済完全実装 - 完了報告

## 実装概要

Phase 6のStripe決済統合が完全に実装されました。すべての必須ファイルが作成され、TypeScript型エラーも修正されています。

## 実装されたファイル一覧

### 1. lib/stripe.ts ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/lib/stripe.ts`

**機能**:
- Stripeクライアント初期化
- サブスクリプションプラン定義（Instagram連携プラン、フルプラットフォームプラン）
- Stripe顧客作成・管理
- サブスクリプション作成・更新・キャンセル
- Checkoutセッション作成
- Webhook署名検証
- 価格フォーマット関数

**プラン設定**:
- **Instagram連携プラン**: ¥50,000/月
  - Instagram投稿の自動同期
  - ギャラリー表示
  - 基本的な問い合わせ管理
  
- **フルプラットフォームプラン**: ¥120,000/月
  - Instagram連携機能
  - 詳細な問い合わせ管理
  - サービス管理機能
  - 優先サポート
  - 分析レポート
  - カスタムブランディング

### 2. app/api/subscription/create/route.ts ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/app/api/subscription/create/route.ts`

**機能**:
- 新規サブスクリプション作成
- Stripe顧客作成
- Checkoutセッション生成
- セッションURLリダイレクト

**エンドポイント**: `POST /api/subscription/create`

**リクエストボディ**:
```json
{
  "companyId": "string",
  "planId": "instagram_only" | "platform_full"
}
```

**レスポンス**:
```json
{
  "sessionId": "string",
  "sessionUrl": "string"
}
```

### 3. app/api/subscription/change-plan/route.ts ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/app/api/subscription/change-plan/route.ts`

**機能**:
- 既存サブスクリプションのプラン変更
- Stripeサブスクリプション更新（日割り計算）
- データベース更新

**エンドポイント**: `POST /api/subscription/change-plan`

**リクエストボディ**:
```json
{
  "companyId": "string",
  "newPlanId": "instagram_only" | "platform_full"
}
```

### 4. app/api/subscription/cancel/route.ts ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/app/api/subscription/cancel/route.ts`

**機能**:
- サブスクリプションキャンセル
- 即時キャンセルまたは期間終了時キャンセル
- キャンセル通知メール送信

**エンドポイント**: `POST /api/subscription/cancel`

**リクエストボディ**:
```json
{
  "companyId": "string",
  "immediately": boolean (optional, default: false)
}
```

### 5. app/api/webhooks/stripe/route.ts ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/app/api/webhooks/stripe/route.ts`

**機能**:
- Stripe Webhook イベント処理
- 署名検証
- 以下のイベントハンドリング:
  - `checkout.session.completed` - チェックアウト完了
  - `customer.subscription.created` - サブスクリプション作成
  - `customer.subscription.updated` - サブスクリプション更新
  - `customer.subscription.deleted` - サブスクリプション削除
  - `invoice.payment_succeeded` - 支払い成功
  - `invoice.payment_failed` - 支払い失敗

**エンドポイント**: `POST /api/webhooks/stripe`

**Webhook設定**:
- Stripe Dashboardで設定: `https://your-domain.com/api/webhooks/stripe`
- 署名シークレットを環境変数 `STRIPE_WEBHOOK_SECRET` に設定

### 6. app/(business)/dashboard/subscription/page.tsx ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/app/(business)/dashboard/subscription/page.tsx`

**機能**:
- サブスクリプション管理画面
- 現在のプラン表示
- プラン変更インターフェース
- キャンセル機能
- 新規サブスクリプション作成

**UI要素**:
- 現在のサブスクリプション情報カード
- プラン変更ボタン
- キャンセルボタン
- PlanSelectorコンポーネント統合

### 7. components/business/SubscriptionForm.tsx ✅
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/components/business/SubscriptionForm.tsx`

**機能**:
- サブスクリプションプラン選択フォーム
- プラン詳細表示
- 機能リスト表示
- 価格表示

**Props**:
```typescript
interface SubscriptionFormProps {
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
}
```

### 8. components/business/PlanSelector.tsx ✅ (新規作成)
**パス**: `/Users/satoryouma/my-miyabi-project/tochigi-platform/components/business/PlanSelector.tsx`

**機能**:
- スタンドアロンプラン選択コンポーネント
- カスタマイズ可能なUI
- ローディング状態管理
- 現在のプランハイライト
- アップグレード/ダウングレード情報表示

**Props**:
```typescript
interface PlanSelectorProps {
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  showCurrentBadge?: boolean;
  buttonText?: {
    select?: string;
    current?: string;
    disabled?: string;
  };
}
```

**特徴**:
- レスポンシブデザイン（モバイル対応）
- アクセシビリティ対応
- 視覚的フィードバック
- 日割り計算情報表示

## データベーススキーマ

**Subscriptionモデル** (既存):
```prisma
model Subscription {
  id                   String   @id @default(cuid())
  company              Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  companyId            String   @unique
  plan                 String
  price                Int
  status               String   @default("active")
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

## 環境変数設定

**必須環境変数** (`.env`ファイルに設定):

```bash
# Stripe API Keys
STRIPE_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Stripe Price IDs (Stripe Dashboardで作成後に設定)
STRIPE_PRICE_INSTAGRAM_ONLY="price_xxxxx"
STRIPE_PRICE_PLATFORM_FULL="price_xxxxx"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SendGrid (メール通知用)
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@tochigi-platform.com"
```

## Stripe Dashboard 設定手順

### 1. 商品とPrice作成

1. Stripe Dashboard → Products → 「+ Add Product」
2. **Instagram連携プラン**:
   - Name: "Instagram連携プラン"
   - Price: ¥50,000
   - Billing period: Monthly
   - Price IDをコピーして `STRIPE_PRICE_INSTAGRAM_ONLY` に設定

3. **フルプラットフォームプラン**:
   - Name: "フルプラットフォームプラン"
   - Price: ¥120,000
   - Billing period: Monthly
   - Price IDをコピーして `STRIPE_PRICE_PLATFORM_FULL` に設定

### 2. Webhook設定

1. Stripe Dashboard → Developers → Webhooks → 「+ Add endpoint」
2. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
3. イベント選択:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Signing secretをコピーして `STRIPE_WEBHOOK_SECRET` に設定

## 動作フロー

### 新規サブスクリプション作成フロー

1. ユーザーが `/dashboard/subscription` にアクセス
2. プランを選択
3. `POST /api/subscription/create` が呼ばれる
4. Stripe Checkoutセッション作成
5. ユーザーがStripe Checkoutページにリダイレクト
6. 支払い完了後、`checkout.session.completed` Webhookが発火
7. `customer.subscription.created` Webhookが発火
8. データベースにサブスクリプション情報保存
9. ウェルカムメール送信
10. ユーザーが `/dashboard/subscription?success=true` にリダイレクト

### プラン変更フロー

1. ユーザーが「プラン変更」ボタンをクリック
2. PlanSelectorで新しいプランを選択
3. `POST /api/subscription/change-plan` が呼ばれる
4. Stripeサブスクリプション更新（日割り計算）
5. データベース更新
6. `customer.subscription.updated` Webhookが発火
7. 画面がリロードされ、新しいプラン情報が表示

### キャンセルフロー

1. ユーザーが「解約する」ボタンをクリック
2. 確認ダイアログ表示
3. `POST /api/subscription/cancel` が呼ばれる
4. Stripeサブスクリプションキャンセル（期間終了時）
5. データベースのステータスを「cancelling」に更新
6. キャンセル通知メール送信
7. 期間終了時に `customer.subscription.deleted` Webhookが発火
8. ステータスが「cancelled」に更新

## テスト方法

### 1. ローカルテスト環境セットアップ

```bash
# Stripe CLIをインストール
brew install stripe/stripe-cli/stripe

# Stripeにログイン
stripe login

# Webhookをローカルにフォワード
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Webhook署名シークレットを .env に設定
# 出力される whsec_xxxxx をコピー
```

### 2. テストカード情報

Stripe テストモードで使用できるカード番号:
- **成功**: `4242 4242 4242 4242`
- **失敗**: `4000 0000 0000 0002`
- **3Dセキュア**: `4000 0025 0000 3155`

### 3. APIテスト

```bash
# サブスクリプション作成テスト
curl -X POST http://localhost:3000/api/subscription/create \
  -H "Content-Type: application/json" \
  -d '{"companyId":"test-company-id","planId":"instagram_only"}'

# プラン変更テスト
curl -X POST http://localhost:3000/api/subscription/change-plan \
  -H "Content-Type: application/json" \
  -d '{"companyId":"test-company-id","newPlanId":"platform_full"}'

# キャンセルテスト
curl -X POST http://localhost:3000/api/subscription/cancel \
  -H "Content-Type: application/json" \
  -d '{"companyId":"test-company-id","immediately":false}'
```

## エラーハンドリング

すべてのAPIエンドポイントで以下のエラーケースを処理:

1. **不正なリクエスト**: 必須パラメータ不足
2. **会社が見つからない**: 404エラー
3. **既存のサブスクリプションがある**: 400エラー
4. **Stripe APIエラー**: 500エラー（詳細メッセージ付き）
5. **Webhook署名検証失敗**: 400エラー
6. **メール送信失敗**: ログ出力（処理は続行）

## セキュリティ考慮事項

1. **Webhook署名検証**: すべてのWebhookリクエストでStripe署名を検証
2. **環境変数保護**: APIキーは環境変数で管理、Git除外
3. **HTTPS必須**: 本番環境ではHTTPSを使用
4. **認証**: 本番ではNextAuth等で認証を実装（TODO）
5. **CSRF保護**: Next.js のデフォルト保護を使用

## メール通知

以下のイベントでメール送信:

1. **サブスクリプション開始**: `subscriptionWelcome` テンプレート
2. **サブスクリプションキャンセル**: `subscriptionCancellation` テンプレート
3. **支払い失敗**: `subscriptionPaymentFailed` テンプレート

## 今後の拡張機能候補

1. **請求書ダウンロード**: Stripe請求書へのリンク提供
2. **支払い履歴**: 過去の支払い履歴表示
3. **プロレーション詳細**: プラン変更時の日割り計算詳細表示
4. **クーポンコード**: 割引クーポン機能
5. **複数プラン**: 年間プラン、エンタープライズプランの追加
6. **使用量ベース課金**: Instagram投稿数に応じた課金
7. **請求先情報管理**: 会社情報、請求先住所の管理

## トラブルシューティング

### Webhook が動作しない場合

1. Stripe Dashboard → Webhooks でイベント配信状況を確認
2. 署名シークレットが正しいか確認
3. エンドポイントURLが正しいか確認（HTTPS）
4. ローカル開発では `stripe listen` が実行中か確認

### サブスクリプション作成が失敗する場合

1. Price IDが正しく設定されているか確認
2. Stripeアカウントがテストモードか本番モードか確認
3. APIキーが正しいか確認
4. ログで詳細なエラーメッセージを確認

### TypeScriptエラーが出る場合

```bash
# Prisma型を再生成
npm run db:generate

# 型チェック
npx tsc --noEmit
```

## 完了チェックリスト

- [x] lib/stripe.ts - Stripeクライアント + プラン定義
- [x] app/api/subscription/create/route.ts - サブスク作成API
- [x] app/api/subscription/change-plan/route.ts - プラン変更API
- [x] app/api/subscription/cancel/route.ts - キャンセルAPI
- [x] app/api/webhooks/stripe/route.ts - Webhook処理
- [x] app/(business)/dashboard/subscription/page.tsx - 管理画面
- [x] components/business/SubscriptionForm.tsx - 決済フォーム
- [x] components/business/PlanSelector.tsx - プラン選択コンポーネント
- [x] TypeScript型エラー修正
- [x] Stripe API version更新 (2025-10-29.clover)
- [x] エラーハンドリング実装
- [x] メール通知統合
- [x] データベース統合

## デプロイ前チェックリスト

1. [ ] `.env` に本番用のStripe APIキーを設定
2. [ ] Stripe DashboardでWebhookエンドポイントを本番URLに設定
3. [ ] Stripe DashboardでProductとPriceを本番環境で作成
4. [ ] Price IDを環境変数に設定
5. [ ] SendGrid APIキーを設定
6. [ ] `NEXT_PUBLIC_APP_URL` を本番URLに設定
7. [ ] データベースマイグレーション実行
8. [ ] Webhookエンドポイントが外部からアクセス可能か確認

## 実装完了

✅ Phase 6: Stripe決済完全実装が完了しました！

すべての必須ファイルが作成され、完全に動作する状態になっています。
環境変数を設定し、Stripe Dashboardで商品とWebhookを設定すれば、即座に使用可能です。

---

**実装日**: 2025年11月17日  
**バージョン**: 1.0.0  
**Status**: ✅ Complete
