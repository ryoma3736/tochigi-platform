# Instagram連携実装 - 検証チェックリスト

## ✅ 実装完了確認

### コアファイル
- [x] `lib/instagram.ts` - Instagram Graph API ラッパー (250行)
- [x] `app/api/instagram/auth/route.ts` - OAuth認証 (138行)
- [x] `app/api/instagram/sync/route.ts` - 投稿同期 (121行)
- [x] `app/api/instagram/posts/route.ts` - 投稿取得 (50行)
- [x] `app/api/instagram/schedule/route.ts` - スケジューラー (142行)
- [x] `app/api/instagram/publish/route.ts` - 投稿公開 (92行)
- [x] `app/api/cron/instagram-sync/route.ts` - 自動同期Cron (172行)
- [x] `components/business/InstagramConnect.tsx` - 認証UI (334行)
- [x] `components/customer/InstagramGallery.tsx` - ギャラリー表示 (174行)
- [x] `app/api/instagram/callback/page.tsx` - OAuthコールバック (52行)

**合計:** 10ファイル、1,525行

---

## 🧪 機能テストチェックリスト

### 基本機能
- [ ] Instagram OAuth認証フロー
- [ ] 短期トークン → 長期トークン変換
- [ ] Instagram投稿の取得
- [ ] データベースへの投稿保存
- [ ] ギャラリー表示

### UI機能
- [ ] InstagramConnect コンポーネント表示
- [ ] 「Instagramと接続」ボタン動作
- [ ] ポップアップ認証ウィンドウ
- [ ] 接続成功メッセージ
- [ ] 接続解除機能

### API機能
- [ ] GET /api/instagram/auth (認証URL取得)
- [ ] POST /api/instagram/auth (トークン交換)
- [ ] DELETE /api/instagram/auth (接続解除)
- [ ] POST /api/instagram/sync (手動同期)
- [ ] GET /api/instagram/posts (投稿取得)
- [ ] POST /api/instagram/publish (投稿公開)
- [ ] GET /api/instagram/schedule (スケジュール取得)
- [ ] POST /api/instagram/schedule (スケジュール作成)
- [ ] GET /api/cron/instagram-sync (自動同期)

### データベース
- [ ] Company.instagramHandle 保存
- [ ] Company.instagramToken 保存
- [ ] InstagramPost レコード作成
- [ ] 重複投稿の防止 (upsert)
- [ ] カスケード削除 (接続解除時)

### セキュリティ
- [ ] OAuth State パラメータ検証
- [ ] Cron Secret 認証
- [ ] postMessage Origin 検証
- [ ] 環境変数の保護

### エラーハンドリング
- [ ] OAuth エラー処理
- [ ] API エラーメッセージ表示
- [ ] トークン期限切れ検出
- [ ] ポップアップブロック検出
- [ ] レート制限エラー処理

---

## 🚀 デプロイ前チェック

### 環境変数
- [ ] INSTAGRAM_CLIENT_ID 設定済み
- [ ] INSTAGRAM_CLIENT_SECRET 設定済み
- [ ] INSTAGRAM_REDIRECT_URI 設定済み
- [ ] CRON_SECRET 設定済み (32文字以上)
- [ ] DATABASE_URL 設定済み
- [ ] SENDGRID_API_KEY 設定済み

### Meta for Developers設定
- [ ] Instagram Graph API アプリ作成済み
- [ ] OAuth Redirect URI 登録済み
- [ ] アプリドメイン設定済み
- [ ] プライバシーポリシーURL設定済み
- [ ] 利用規約URL設定済み

### データベース
- [ ] Prisma スキーマ確認
- [ ] マイグレーション実行済み
- [ ] Company テーブル確認
- [ ] InstagramPost テーブル確認
- [ ] インデックス設定確認

### Vercel設定
- [ ] 環境変数をVercelに設定
- [ ] vercel.json に Cron設定追加
- [ ] ドメイン設定 (本番環境)
- [ ] HTTPS 有効化確認

---

## 📋 本番公開前の最終確認

### Instagram API設定
- [ ] 実際のInstagram Businessアカウントで接続テスト
- [ ] 投稿が正常に同期されることを確認
- [ ] ギャラリーに投稿が表示されることを確認
- [ ] いいね数・コメント数が取得できることを確認

### Cronジョブ
- [ ] 手動実行テスト成功
- [ ] Authorization ヘッダー確認
- [ ] 複数企業の同期テスト
- [ ] エラーメール送信確認
- [ ] 成功メール送信確認

### パフォーマンス
- [ ] 画像読み込み速度確認
- [ ] API レスポンス時間測定
- [ ] レート制限対策確認
- [ ] データベースクエリ最適化

### ユーザー体験
- [ ] モバイル表示確認
- [ ] タブレット表示確認
- [ ] デスクトップ表示確認
- [ ] ローディング状態表示
- [ ] エラーメッセージの分かりやすさ

---

## 🐛 既知の制限事項

### Instagram API制限
- 200 calls/hour per user
- 長期トークンは60日で期限切れ
- 個人アカウント非対応 (Business/Creatorのみ)

### 現在の実装制限
- 投稿スケジュール機能は簡易実装
- トークン自動リフレッシュ未実装
- ストーリーズ非対応
- CAROUSEL_ALBUM の複数画像表示未対応

---

## 📈 今後の改善案

### 優先度: 高
- [ ] トークン自動リフレッシュ機能
- [ ] エラーログの集約・監視
- [ ] パフォーマンスモニタリング

### 優先度: 中
- [ ] 投稿スケジュール機能の完全実装 (Bull/BullMQ)
- [ ] 分析ダッシュボード (エンゲージメント率など)
- [ ] 複数画像投稿 (CAROUSEL_ALBUM) 対応

### 優先度: 低
- [ ] Instagram Stories 対応
- [ ] Instagram Reels 対応
- [ ] ハッシュタグ分析機能

---

## 📞 サポート情報

### ドキュメント
- PHASE_5_INSTAGRAM_COMPLETION_REPORT.md - 完全実装報告
- INSTAGRAM_QUICK_START.md - クイックスタートガイド
- API_DOCUMENTATION.md - API仕様書

### 外部リンク
- Instagram Graph API: https://developers.facebook.com/docs/instagram-api
- Meta for Developers: https://developers.facebook.com/

---

**検証日:** 2025年11月17日
**バージョン:** 1.0.0
**ステータス:** ✅ 実装完了、テスト準備完了
