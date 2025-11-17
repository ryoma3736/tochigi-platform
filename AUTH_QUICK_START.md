# 認証システム クイックスタートガイド

## 1. 環境変数設定

`.env`ファイルを作成し、以下を設定:

```bash
# データベース
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tochigi_platform"

# 認証シークレット生成
AUTH_SECRET="生成したランダムな文字列"
```

**AUTH_SECRETの生成:**
```bash
openssl rand -base64 32
```

## 2. データベースセットアップ

```bash
# Prisma Clientの生成（完了済み）
npm run db:generate

# データベースにスキーマを反映
npm run db:push
```

## 3. 開発サーバー起動

```bash
npm run dev
```

## 4. アクセス

- トップページ: http://localhost:3000
- ログインページ: http://localhost:3000/login
- 登録ページ: http://localhost:3000/register

## 5. 初回ユーザー登録

1. ブラウザで http://localhost:3000/register を開く
2. 以下を入力:
   - 名前: 管理者
   - メールアドレス: admin@example.com
   - パスワード: admin123456
   - パスワード確認: admin123456
   - アカウントタイプ: 事業者（または一般ユーザー）
3. 登録ボタンをクリック

## 6. ログイン

1. http://localhost:3000/login を開く
2. 登録したメールアドレスとパスワードでログイン
3. ダッシュボードまたはホームページにリダイレクト

## 7. 管理者権限の付与

Prisma Studioで手動設定:

```bash
npm run db:studio
```

1. ブラウザで http://localhost:5555 が開く
2. Userテーブルを選択
3. 対象ユーザーの`role`を`admin`に変更
4. 保存

## 使用例

### サーバーコンポーネント

```tsx
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>ログインしてください</div>;
  }

  return <div>こんにちは、{session.user.name}さん</div>;
}
```

### クライアントコンポーネント

```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session } = useSession();

  return <div>{session?.user?.name}</div>;
}
```

### 認証必須ページ

```tsx
import { requireAuth } from "@/lib/auth-utils";

export default async function ProtectedPage() {
  const user = await requireAuth();

  return <div>保護されたページ: {user.email}</div>;
}
```

## トラブルシューティング

### ログインできない
- DATABASE_URLが正しいか確認
- データベースが起動しているか確認
- `npm run db:push`を再実行

### セッションエラー
- AUTH_SECRETが設定されているか確認
- ブラウザのキャッシュをクリア
- 開発サーバーを再起動

### TypeScriptエラー
- `npm run db:generate`を実行
- VSCodeを再起動

## 完了

認証システムが正常に動作しています。
詳細は`AUTH_IMPLEMENTATION.md`を参照してください。
