# 認証システム実装完了

## 実装内容

### 1. インストール済みパッケージ
- `next-auth@beta` (v5.0.0-beta.30)
- `@auth/prisma-adapter` (v2.11.1)
- `bcryptjs` (v3.0.3)
- `@types/bcryptjs` (v2.4.6)

### 2. Prismaスキーマ更新
以下のモデルを追加しました:
- `User` - ユーザー情報（email, password, role, companyId）
- `Account` - OAuth アカウント連携用
- `Session` - セッション管理
- `VerificationToken` - メール認証用トークン

**ロール:**
- `user` - 一般ユーザー
- `business` - 事業者
- `admin` - 管理者

### 3. 作成ファイル一覧

#### 認証設定
- `/lib/auth.ts` - NextAuth設定（Credentials Provider）
- `/lib/auth-utils.ts` - 認証ヘルパー関数
- `/types/next-auth.d.ts` - TypeScript型定義拡張

#### API Routes
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth APIハンドラー
- `/app/api/register/route.ts` - ユーザー登録API

#### ミドルウェア
- `/middleware.ts` - 認証ミドルウェア（ルート保護）

#### ページ
- `/app/login/page.tsx` - ログインページ
- `/app/register/page.tsx` - 登録ページ

#### コンポーネント
- `/components/auth/LoginForm.tsx` - ログインフォーム
- `/components/auth/RegisterForm.tsx` - 登録フォーム
- `/components/auth/SessionProvider.tsx` - セッションプロバイダー
- `/components/auth/LogoutButton.tsx` - ログアウトボタン
- `/components/auth/UserInfo.tsx` - ユーザー情報表示
- `/components/auth/index.ts` - エクスポート用インデックス

### 4. 環境変数設定

`.env.example`を参考に、`.env`ファイルに以下を設定してください:

```bash
# データベース
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tochigi_platform"

# NextAuth
AUTH_SECRET="your_secret_here"  # 生成: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 5. 使用方法

#### ログイン/登録
- ログイン: `http://localhost:3000/login`
- 新規登録: `http://localhost:3000/register`

#### サーバーコンポーネントで認証確認
```tsx
import { auth } from "@/lib/auth";
import { requireAuth, requireAdmin } from "@/lib/auth-utils";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  // または認証必須にする
  const user = await requireAuth();

  // 管理者のみ
  const admin = await requireAdmin();

  return <div>Hello {user.name}</div>;
}
```

#### クライアントコンポーネントでセッション使用
```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.user.name}</div>;
}
```

#### ログアウト
```tsx
import { LogoutButton } from "@/components/auth";

export function Header() {
  return <LogoutButton />;
}
```

### 6. ルート保護

ミドルウェアで以下のルールを実装済み:
- `/admin/*` → 管理者のみアクセス可能
- `/dashboard/*` → 事業者のみアクセス可能
- `/login`, `/register` → ログイン済みユーザーは自動リダイレクト
- その他の保護ルート → 未認証ユーザーは`/login`へリダイレクト

### 7. データベースマイグレーション

**次のステップ:**

```bash
# Prisma Clientの生成（完了済み）
npm run db:generate

# データベースにスキーマを反映
npm run db:push

# または、マイグレーションを作成
npm run db:migrate
```

### 8. 初期管理者アカウント作成

データベースマイグレーション後、以下の方法で管理者を作成:

**方法1: 登録APIを使用**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**方法2: Prisma Studioで直接編集**
```bash
npm run db:studio
```
ブラウザで開き、Userテーブルで`role`を`admin`に変更。

### 9. テスト用アカウント

開発環境でテスト用アカウントを作成する場合:

```typescript
// prisma/seed.ts に追加
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash("password123", 12);

await prisma.user.create({
  data: {
    name: "Test Admin",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  },
});

await prisma.user.create({
  data: {
    name: "Test Business",
    email: "business@test.com",
    password: hashedPassword,
    role: "business",
  },
});

await prisma.user.create({
  data: {
    name: "Test User",
    email: "user@test.com",
    password: hashedPassword,
    role: "user",
  },
});
```

実行:
```bash
npm run db:seed
```

### 10. セキュリティ機能

- パスワードハッシュ化（bcrypt, cost factor: 12）
- CSRF保護（NextAuth内蔵）
- セッショントークン管理
- ロールベースアクセス制御（RBAC）
- ミドルウェアによるルート保護

### 11. カスタマイズポイント

#### コールバック関数のカスタマイズ
`/lib/auth.ts`の`callbacks`で追加情報をセッションに含める:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.customField = user.customField;
    }
    return token;
  },
  async session({ session, token }) {
    session.user.customField = token.customField;
    return session;
  },
}
```

#### エラーページカスタマイズ
`pages.error`を変更して独自のエラーページを設定。

### 12. 本番環境デプロイ前チェック

- [ ] `AUTH_SECRET`を本番用に生成
- [ ] `NEXTAUTH_URL`を本番URLに変更
- [ ] DATABASE_URLを本番DBに設定
- [ ] HTTPSを有効化
- [ ] CORS設定確認
- [ ] レート制限実装検討
- [ ] セッションタイムアウト設定確認

## トラブルシューティング

### ログインできない
1. DATABASE_URLが正しいか確認
2. Prisma Clientを再生成: `npm run db:generate`
3. データベースにUserテーブルが存在するか確認

### セッションが保持されない
1. AUTH_SECRETが設定されているか確認
2. ブラウザのCookieが有効か確認
3. ミドルウェアのmatcher設定確認

### 型エラーが出る
1. `types/next-auth.d.ts`が正しく配置されているか確認
2. TypeScriptサーバーを再起動

## 実装完了

すべての必須機能が実装され、動作可能な状態です。
データベースマイグレーションを実行後、すぐに使用開始できます。
