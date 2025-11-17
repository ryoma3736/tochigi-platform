# API Documentation

## 概要

栃木プラットフォームのREST APIドキュメントです。

## ベースURL

```
http://localhost:3000/api
```

---

## 公開API（認証不要）

### 業者関連

#### 業者一覧取得

```
GET /api/companies
```

**クエリパラメータ:**
- `categoryId` (string, optional): カテゴリーIDでフィルタ
- `search` (string, optional): 検索キーワード（業者名、説明で検索）
- `page` (number, optional, default: 1): ページ番号
- `limit` (number, optional, default: 10): 1ページあたりの件数
- `sortBy` (string, optional, default: 'createdAt'): ソート項目 (name, createdAt, updatedAt)
- `order` (string, optional, default: 'desc'): ソート順 (asc, desc)

**レスポンス例:**
```json
{
  "data": [
    {
      "id": "xxx",
      "name": "業者名",
      "email": "email@example.com",
      "phone": "0280-xx-xxxx",
      "description": "説明文",
      "address": "栃木県小山市...",
      "category": {
        "id": "xxx",
        "name": "カテゴリー名",
        "slug": "category-slug"
      },
      "services": [...],
      "_count": {
        "services": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 業者詳細取得

```
GET /api/companies/:id
```

**レスポンス例:**
```json
{
  "id": "xxx",
  "name": "業者名",
  "email": "email@example.com",
  "phone": "0280-xx-xxxx",
  "description": "説明文",
  "address": "栃木県小山市...",
  "category": {
    "id": "xxx",
    "name": "カテゴリー名",
    "slug": "category-slug",
    "description": "カテゴリー説明"
  },
  "services": [...],
  "instagramPosts": [...],
  "_count": {
    "services": 5,
    "instagramPosts": 20
  }
}
```

#### 業者のサービス一覧取得

```
GET /api/companies/:id/services
```

**クエリパラメータ:**
- `isActive` (boolean, optional): アクティブなサービスのみ取得
- `page` (number, optional, default: 1): ページ番号
- `limit` (number, optional, default: 10): 1ページあたりの件数

**レスポンス例:**
```json
[
  {
    "id": "xxx",
    "name": "サービス名",
    "description": "サービス説明",
    "priceFrom": 10000,
    "priceTo": 50000,
    "unit": "円/回",
    "isActive": true
  }
]
```

### カテゴリー関連

#### カテゴリー一覧取得

```
GET /api/categories
```

**クエリパラメータ:**
- `includeCount` (boolean, optional): 業者数を含めるか

**レスポンス例:**
```json
[
  {
    "id": "xxx",
    "name": "カテゴリー名",
    "slug": "category-slug",
    "description": "説明",
    "_count": {
      "companies": 15
    }
  }
]
```

### 問い合わせ関連

#### 問い合わせ作成

```
POST /api/inquiries
```

**リクエストボディ:**
```json
{
  "customerName": "山田太郎",
  "customerEmail": "yamada@example.com",
  "customerPhone": "090-1234-5678",
  "message": "お問い合わせ内容",
  "selectedItems": ["company-id-1", "company-id-2"]
}
```

**レスポンス例:**
```json
{
  "id": "xxx",
  "customerName": "山田太郎",
  "customerEmail": "yamada@example.com",
  "customerPhone": "090-1234-5678",
  "message": "お問い合わせ内容",
  "status": "sent",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "companies": [...]
}
```

---

## 業者向けAPI（認証必要）

### 認証

現在は簡易的に `x-company-id` ヘッダーで業者IDを送信します。
将来的にはJWTベースの認証を実装予定。

**リクエストヘッダー:**
```
x-company-id: your-company-id
```

### プロフィール関連

#### プロフィール取得

```
GET /api/business/profile
```

**レスポンス例:**
```json
{
  "id": "xxx",
  "name": "業者名",
  "email": "email@example.com",
  "phone": "0280-xx-xxxx",
  "description": "説明文",
  "address": "栃木県小山市...",
  "category": {...},
  "subscription": {...},
  "_count": {
    "services": 5,
    "inquiries": 10,
    "instagramPosts": 20
  }
}
```

#### プロフィール更新

```
PUT /api/business/profile
```

**リクエストボディ:**
```json
{
  "name": "業者名",
  "email": "email@example.com",
  "phone": "0280-xx-xxxx",
  "description": "説明文",
  "address": "栃木県小山市...",
  "categoryId": "category-id",
  "instagramHandle": "instagram_handle",
  "instagramToken": "token"
}
```

### サービス管理

#### サービス一覧取得

```
GET /api/business/services
```

**クエリパラメータ:**
- `isActive` (boolean, optional): アクティブなサービスのみ
- `page` (number, optional, default: 1): ページ番号
- `limit` (number, optional, default: 10): 1ページあたりの件数

#### サービス作成

```
POST /api/business/services
```

**リクエストボディ:**
```json
{
  "name": "サービス名",
  "description": "サービス説明",
  "priceFrom": 10000,
  "priceTo": 50000,
  "unit": "円/回",
  "isActive": true
}
```

#### サービス詳細取得

```
GET /api/business/services/:id
```

#### サービス更新

```
PUT /api/business/services/:id
```

**リクエストボディ:**
```json
{
  "name": "サービス名",
  "description": "サービス説明",
  "priceFrom": 10000,
  "priceTo": 50000,
  "unit": "円/回",
  "isActive": true
}
```

#### サービス削除

```
DELETE /api/business/services/:id
```

### 問い合わせ管理

#### 問い合わせ一覧取得

```
GET /api/business/inquiries
```

**クエリパラメータ:**
- `status` (string, optional): ステータスでフィルタ (sent, contacted, completed, cancelled)
- `page` (number, optional, default: 1): ページ番号
- `limit` (number, optional, default: 10): 1ページあたりの件数
- `sortBy` (string, optional, default: 'createdAt'): ソート項目
- `order` (string, optional, default: 'desc'): ソート順

#### 問い合わせ詳細取得

```
GET /api/business/inquiries/:id
```

#### 問い合わせステータス更新

```
PATCH /api/business/inquiries/:id
```

**リクエストボディ:**
```json
{
  "status": "contacted"
}
```

**ステータスの種類:**
- `sent`: 送信済み
- `contacted`: 連絡済み
- `completed`: 完了
- `cancelled`: キャンセル

---

## エラーレスポンス

すべてのエラーは以下の形式で返されます:

```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

**HTTPステータスコード:**
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: アクセス権限なし
- `404 Not Found`: リソースが見つからない
- `409 Conflict`: 重複エラー
- `500 Internal Server Error`: サーバーエラー

**バリデーションエラーの例:**
```json
{
  "error": {
    "message": "バリデーションエラー",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["有効なメールアドレスを入力してください"],
      "phone": ["有効な電話番号を入力してください"]
    }
  }
}
```

---

## 開発環境でのテスト

### cURLでのテスト例

```bash
# 業者一覧取得
curl http://localhost:3000/api/companies

# カテゴリー一覧取得
curl http://localhost:3000/api/categories?includeCount=true

# 問い合わせ作成
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "山田太郎",
    "customerEmail": "yamada@example.com",
    "customerPhone": "090-1234-5678",
    "message": "お問い合わせ内容",
    "selectedItems": ["company-id-1"]
  }'

# 業者向け: サービス一覧取得
curl http://localhost:3000/api/business/services \
  -H "x-company-id: your-company-id"
```
