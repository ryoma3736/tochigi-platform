# Instagram連携 クイックスタートガイド

## 🚀 セットアップ (5分で完了)

### 1. Instagram Developer設定

1. **Meta for Developers** にアクセス
   - https://developers.facebook.com/

2. **アプリを作成**
   - 「アプリを作成」をクリック
   - 用途: 「ビジネス」を選択
   - アプリ名: 「栃木プラットフォーム」など

3. **Instagram Graph API を追加**
   - ダッシュボード → 「製品を追加」
   - 「Instagram Graph API」を選択

4. **OAuth設定**
   ```
   設定 → 基本設定 → 「アプリドメイン」
   - アプリドメイン: your-domain.com
   - プライバシーポリシーURL: https://your-domain.com/privacy
   - 利用規約URL: https://your-domain.com/terms

   Instagram Graph API → 設定
   - 有効なOAuthリダイレクトURI:
     http://localhost:3000/api/instagram/callback
     https://your-domain.vercel.app/api/instagram/callback
   ```

5. **認証情報を取得**
   - 設定 → 基本設定
   - アプリID (INSTAGRAM_CLIENT_ID)
   - アプリシークレット (INSTAGRAM_CLIENT_SECRET)

### 2. 環境変数設定

`.env` ファイルを作成:

```bash
# Instagram API
INSTAGRAM_CLIENT_ID="あなたのアプリID"
INSTAGRAM_CLIENT_SECRET="あなたのアプリシークレット"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/api/instagram/callback"

# Cron Secret (ランダムな文字列)
CRON_SECRET="ランダムな32文字以上の文字列"
```

**Cron Secretの生成:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. データベースセットアップ

```bash
# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:push
```

### 4. アプリ起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

---

## 📝 使い方

### 事業者側: Instagram接続

1. **ダッシュボードにアクセス**
   ```
   /dashboard
   ```

2. **Instagram連携セクション**
   - 「Instagramと接続」ボタンをクリック
   - ポップアップでInstagram認証
   - 自動的に投稿が同期される

3. **手動同期**
   - 「今すぐ同期」ボタンで最新投稿を取得

4. **接続解除**
   - 「接続解除」ボタンで連携を切断
   - 同期済み投稿も削除される

### 顧客側: Instagram投稿表示

企業ページにアクセス:
```
/companies/[id]
```

Instagramギャラリーが自動的に表示されます。

---

## 🔧 コンポーネント使用例

### InstagramConnect (事業者用)

```tsx
'use client';

import InstagramConnect from '@/components/business/InstagramConnect';

export default function DashboardPage() {
  const [company, setCompany] = useState(null);

  return (
    <InstagramConnect
      companyId={company.id}
      isConnected={!!company.instagramToken}
      instagramHandle={company.instagramHandle}
      onConnectionChange={() => {
        // 接続状態が変わったら企業情報を再取得
        fetchCompany();
      }}
    />
  );
}
```

### InstagramGallery (顧客用)

```tsx
import { InstagramGallery } from '@/components/customer/InstagramGallery';

export default function CompanyPage({ company }) {
  return (
    <InstagramGallery
      companyId={company.id}
      instagramHandle={company.instagramHandle}
      limit={6}
    />
  );
}
```

---

## 🔄 API エンドポイント

### 1. Instagram認証開始
```typescript
GET /api/instagram/auth?companyId=xxx

Response:
{
  "authUrl": "https://api.instagram.com/oauth/authorize?..."
}
```

### 2. 認証完了 (トークン交換)
```typescript
POST /api/instagram/auth
Body: {
  "code": "認証コード",
  "state": "Base64エンコードされたcompanyId"
}

Response:
{
  "success": true,
  "username": "instagram_username",
  "expiresIn": 5183944
}
```

### 3. 投稿同期
```typescript
POST /api/instagram/sync
Body: {
  "companyId": "xxx"
}

Response:
{
  "success": true,
  "syncedCount": 25,
  "totalPosts": 25
}
```

### 4. 投稿取得
```typescript
GET /api/instagram/posts?companyId=xxx&limit=12

Response:
{
  "posts": [
    {
      "id": "post_xxx",
      "postId": "instagram_post_id",
      "caption": "投稿のキャプション",
      "mediaUrl": "https://...",
      "mediaType": "IMAGE",
      "permalink": "https://instagram.com/p/xxx",
      "timestamp": "2025-11-17T00:00:00.000Z",
      "likesCount": 100,
      "commentsCount": 10
    }
  ]
}
```

### 5. 投稿公開
```typescript
POST /api/instagram/publish
Body: {
  "companyId": "xxx",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "投稿のキャプション"
}

Response:
{
  "success": true,
  "postId": "instagram_post_id",
  "permalink": "https://instagram.com/p/xxx"
}
```

---

## ⏰ 自動同期 (Cron設定)

### Vercel Cronの設定

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

スケジュール形式 (Cron式):
- `0 */6 * * *` - 6時間ごと (推奨)
- `0 */1 * * *` - 1時間ごと
- `0 0 * * *` - 毎日0時

### 手動実行 (テスト用)

```bash
curl http://localhost:3000/api/cron/instagram-sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🔐 セキュリティチェックリスト

- [ ] Instagram Client ID/Secret を環境変数に設定
- [ ] Cron Secret を32文字以上のランダム文字列に
- [ ] 本番環境では HTTPS を使用
- [ ] OAuth Redirect URI を Meta for Developers に登録
- [ ] データベース接続文字列を保護
- [ ] .env ファイルを .gitignore に追加

---

## 🐛 トラブルシューティング

### 問題: ポップアップがブロックされる
**解決策:** ブラウザのポップアップブロックを解除

### 問題: OAuth認証エラー
**解決策:**
1. Redirect URIが正しく登録されているか確認
2. アプリが「開発モード」になっていないか確認
3. Instagram Business/Creatorアカウントか確認

### 問題: 投稿が同期されない
**解決策:**
1. Instagram Token が有効か確認
2. API レート制限に達していないか確認
3. 同期エラーメールを確認

### 問題: Cron ジョブが動かない
**解決策:**
1. Vercel Pro プランか確認 (Cron機能はProプラン以上)
2. Authorization ヘッダーが正しいか確認
3. Vercel ダッシュボードでログを確認

---

## 📊 Instagram API制限

### レート制限
- **200 calls/hour per user**
- 本実装: 1秒間隔で処理 (安全)

### トークン有効期限
- **短期トークン:** 1時間
- **長期トークン:** 60日
- 本実装: 長期トークンを自動取得

### 投稿取得上限
- **1回のリクエスト:** 最大50件
- 本実装: 50件を取得

---

## 📱 必須要件

### Instagramアカウント
- ✅ Instagram Business アカウント
- ✅ Instagram Creator アカウント
- ❌ 個人アカウント (非対応)

### Facebookページ
- Instagram Business アカウントは Facebook ページに接続が必要

### Meta for Developers
- Facebook Developer アカウント
- Instagram Graph API アプリ

---

## 🎯 次のステップ

1. **開発環境でテスト**
   - ローカルで動作確認
   - 実際のInstagramアカウントで接続テスト

2. **本番環境へデプロイ**
   - Vercel にデプロイ
   - 環境変数を設定
   - Cron ジョブを設定

3. **Meta アプリレビュー (本番公開時)**
   - アプリを「ライブモード」に
   - 必要に応じてレビュー申請

4. **機能拡張**
   - 投稿スケジュール機能
   - 分析ダッシュボード
   - ストーリーズ対応

---

## 📚 参考リンク

- [Instagram Graph API ドキュメント](https://developers.facebook.com/docs/instagram-api)
- [Meta for Developers](https://developers.facebook.com/)
- [Vercel Cron ドキュメント](https://vercel.com/docs/cron-jobs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**作成日:** 2025年11月17日
**バージョン:** 1.0.0
