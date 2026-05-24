# Polaris — サロン経営AIプラットフォーム

Next.js 15 / Prisma / PostgreSQL / Anthropic Claude を使った、1ユーザー専用のサロン経営支援アプリ。

## 機能

- ログイン（パスワード1つ、iron-session Cookie）
- ダッシュボード：KPI4種・月次推移グラフ・AI経営示唆
- 売上入力：月次データの追加／上書き
- 顧客管理：登録＋来店履歴によるセグメント自動分類（優良 / 安定 / 新規 / 離脱予兆）
- 口コミ：手入力＋AI返信ドラフト生成＋返信本文編集・保存
- AIコンテンツ：ブログ記事生成 / Instagramキャプション生成
- 設定：AI接続状況確認

AIキー未設定でもテンプレ出力で動作確認可能。

## ローカルで動かす

```bash
cd /Users/kabushikikaishashitsutoru/CODE/polaris
cp .env.example .env
# .env を編集（最低 DATABASE_URL / ADMIN_PASSWORD / SESSION_SECRET）

npm install
npx prisma migrate dev
npm run dev
# → http://localhost:3000
```

または Docker Compose で一発：

```bash
cp .env.example .env
docker compose up --build
```

## ConoHa VPS Coolify へのデプロイ

1. **Coolify → New Resource → Application** → このリポジトリ（GitやGitHubに上げる）を指定
2. **Build Pack**: Dockerfile
3. **Resource → New Database → PostgreSQL 16** を追加し、出てきた接続文字列を `DATABASE_URL` にコピー
4. **Environment Variables** に以下を設定：
   ```
   DATABASE_URL          = （Coolifyが発行したPostgres URL）
   ADMIN_PASSWORD        = 強いパスワード
   SESSION_SECRET        = openssl rand -hex 32 で生成
   ANTHROPIC_API_KEY     = sk-ant-...（任意）
   ANTHROPIC_MODEL       = claude-haiku-4-5-20251001（任意）
   ```
5. **Domain** を設定（例: `polaris.your-domain.com`）→ Let's Encrypt 自動
6. **Deploy** ボタン

初回起動時に `prisma migrate deploy` が自動実行されてテーブルが作られます。

## バックアップ

Coolifyの「Backups」機能でPostgresの自動バックアップを設定するか、手動で：

```bash
docker exec <postgres-container> pg_dump -U polaris polaris > backup-$(date +%F).sql
```

## ディレクトリ構成

```
polaris/
├── prisma/
│   ├── schema.prisma            # Sale / Customer / Review / Setting
│   └── migrations/              # 初期マイグレーション
├── src/
│   ├── lib/
│   │   ├── db.ts                # Prisma client (singleton)
│   │   ├── session.ts           # iron-session 認証
│   │   └── ai.ts                # Anthropic SDK ラッパー（フォールバック付き）
│   ├── components/
│   │   └── Sidebar.tsx
│   └── app/
│       ├── login/               # ログイン画面
│       ├── (app)/
│       │   ├── layout.tsx       # 認証ガード＋サイドバー
│       │   ├── dashboard/       # KPI + Chart + AI示唆
│       │   ├── sales/           # 月次売上 CRUD
│       │   ├── customers/       # 顧客 CRUD + 自動セグメント
│       │   ├── reviews/         # 口コミ + AI返信
│       │   ├── blog/            # ブログ / Instagram 生成
│       │   └── settings/
│       └── api/
│           ├── login / logout
│           ├── sales / customers / reviews
│           └── ai                # サーバー側AIプロキシ（キー秘匿）
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## セキュリティ・運用メモ

- **APIキーはサーバー側のみ**。ブラウザには漏れません。
- **認証は1ユーザー専用**。マルチユーザー化する場合は User テーブル＋bcrypt＋セッションのスコープ化が必要。
- **CSRF**: Same-Site Lax Cookie に依存。外部からのフォームPOSTは想定していません。
- **レート制限**は未実装。公開時はCoolifyのリバプロ層 or `@upstash/ratelimit` 等で対応してください。

## 既知の制限（今後の拡張）

- Google Business Profile 連携（口コミ自動取得）
- LINE Messaging API（離脱予兆顧客への自動配信）
- Instagram Graph API（投稿予約）
- POS / Google Calendar 連携（売上・予約の自動取り込み）
- CSV インポート UI（現在は手入力 or 直接DB投入）
