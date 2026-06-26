# HSNPhira フロントエンド

HyperSynapse Network Phira マルチプレイヤーゲームサーバーフロントエンドアプリケーション

## プロジェクト概要

> 本プロジェクトは複数のトップAI研究所による技術支援を受けています<br>
> 本プロジェクトは様々なAIツールを使用して開発されています

これは Vue 3 + TypeScript + Tailwind CSS で構築されたモダンなWebアプリケーションで、HSNPhiraマルチプレイヤーゲームサーバーに完全なフロントエンドインターフェースを提供します。
HSNPhira フロントエンドは HSNPhira バックエンドと phira-mp-logprocessor によってバックエンドサポートを提供されています。

## 技術スタック

- **フレームワーク**: Vue 3 (Composition API)
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイル**: Tailwind CSS
- **状態管理**: Pinia
- **ルーティング**: Vue Router
- **HTTP クライアント**: Axios
- **静的サイト生成 (SSG)**: vite-ssg

## プロジェクト構造

```
HSNPhira/
├── public/                     # 静的リソース
│   ├── config/                # 設定ファイル
│   │   ├── app.config.json    # アプリケーション設定（APIルート、外部サービスURL等）
│   │   ├── preferences.config.json  # ユーザー設定
│   │   ├── version.json       # バージョン情報（自動更新チェック用）
│   │   ├── global.config.json       # グローバル設定（サーバーアドレス、QQグループ等）
│   │   ├── download.config.json    # ダウンロードページ設定
│   │   ├── navigation.config.json  # ナビゲーションページ設定
│   │   ├── announcement.config.json # お知らせページ設定
│   │   ├── about.config.json       # 私たちについてページ設定
│   │   └── docs.config.json        # ドキュメントページ設定
│   ├── docs/                  # ドキュメントディレクトリ
│   │   └── guide.md          # ガイドドキュメント
│   ├── images/               # 画像リソース
│   ├── .well-known/          # デジタルアセットリンク
│   │   └── assetlinks.json   # Androidデジタルアセットリンクファイル
│   └── index.html            # メインHTMLファイル
├── src/                       # Vue フロントエンドソースコード
│   ├── api/                  # APIインターフェース層
│   │   ├── index.ts          # APIクライアント設定
│   │   ├── server.ts         # サーバーAPIラッパー
│   │   ├── charts.ts         # 譜面関連API
│   │   └── auth.ts           # 認証関連API
│   ├── components/           # 再利用可能なコンポーネント
│   │   ├── common/          # 共通コンポーネント
│   │   │   ├── Button.vue      # ボタンコンポーネント
│   │   │   ├── Header.vue      # ヘッダーナビゲーションコンポーネント
│   │   │   ├── Footer.vue      # フッターコンポーネント
│   │   │   ├── Message.vue     # メッセージ表示コンポーネント
│   │   │   └── Table.vue       # テーブルコンポーネント
│   │   ├── windows/         # ウィンドウコンポーネント（モーダル、ポップアップ）
│   │   │   ├── Window.vue                # 基本ウィンドウコンポーネント
│   │   │   ├── WindowChart.vue           # 譜面詳細ウィンドウ
│   │   │   ├── WindowChartDownload.vue   # 譜面ダウンロードウィンドウ
│   │   │   ├── WindowRoomHistory.vue     # プレイ履歴ウィンドウ
│   │   │   ├── WindowAuth.vue            # 認証ウィンドウ
│   │   │   ├── WindowRoomPlayers.vue     # ルームプレイヤーウィンドウ
│   │   │   └── WindowManager.vue         # ウィンドウマネージャー
│   │   ├── background/      # 背景エフェクトコンポーネント
│   │   ├── Lightbox.vue     # 画像ライトボックスコンポーネント
│   │   ├── ServerStatus.vue # サーバーステータスコンポーネント
│   │   └── PageUpdate.vue   # ページ更新通知コンポーネント
│   ├── i18n/                 # 国際化設定
│   │   └── index.ts         # 多言語翻訳ファイル（zh、zh-TW、en、ja対応）
│   ├── router/               # ルーティング設定
│   ├── stores/               # 状態管理（Pinia）
│   │   ├── index.ts         # ユーザー状態管理
│   │   ├── i18n.ts          # 国際化状態管理
│   │   ├── theme.ts         # テーマ状態管理（ダーク/ライト/ハイコントラスト）
│   │   └── windowManager.ts # ウィンドウマネージャー状態
│   ├── utils/                # ユーティリティ関数
│   │   ├── config.ts        # 設定ファイル読み込み・解析ツール
│   │   ├── docs.ts          # ドキュメント処理ツール
│   │   ├── meta.ts          # メタタグ・SEO管理ツール
│   │   ├── message.ts       # メッセージユーティリティ関数
│   │   └── eventBus.ts      # イベントバスツール
│   ├── types/                # TypeScript型定義
│   ├── styles/               # グローバルスタイル
│   │   └── main.css         # Tailwind CSSとカスタムスタイル
│   ├── views/                # ページビューコンポーネント
│   │   ├── Home.vue         # ホームページ
│   │   ├── RoomList.vue     # ルーム一覧
│   │   ├── ChartRanking.vue # 譜面ランキング
│   │   ├── UserRanking.vue  # ユーザーランキング
│   │   ├── Announcement.vue # お知らせページ
│   │   ├── Agreement.vue    # 利用規約ページ
│   │   ├── Account.vue      # アカウント管理ページ
│   │   ├── PhiraDownload.vue  # Phiraダウンロードページ
│   │   ├── ChartDownload.vue  # 譜面ダウンロードページ
│   │   ├── Navigation.vue     # ナビゲーションページ
│   │   ├── About.vue          # 私たちについてページ
│   │   ├── DocsHome.vue       # ドキュメントホームページ
│   │   ├── DocPage.vue        # ドキュメント詳細ページ
│   │   └── NotFound.vue       # 404ページ
│   ├── App.vue               # ルートコンポーネント
│   ├── main.ts               # アプリケーションエントリーポイント
│   └── vite-env.d.ts         # Vite環境型定義
├── HSNPM/                     # Rust通知サービス（WebPushバックエンド）
│   ├── src/                  # Rustソースコード
│   │   └── main.rs           # メインプログラムエントリー
│   ├── .env.example          # 環境変数サンプル
│   ├── Cargo.toml            # Rust依存関係設定
│   ├── Cargo.lock            # 依存関係ロックファイル
│   ├── docker-compose.yml    # Docker Compose設定
│   ├── Dockerfile            # Dockerビルド設定
│   └── README.md             # HSNPM使用ドキュメント
├── scripts/                   # ビルド・デプロイスクリプト
│   ├── update-download-config.js # ダウンロード設定更新スクリプト
│   ├── setup-webpush.sh      # WebPush設定スクリプト
│   ├── generate-icons.js     # PWAアイコン生成スクリプト
│   ├── generate-seo-files.js # SEOファイル生成スクリプト
│   ├── deploy-to-server.sh   # サーバーデプロイスクリプト
│   ├── deploy-hsnpm-start.sh # HSNPM起動スクリプト
│   ├── deploy-hsnpm-systemd.service # HSNPM systemdサービス設定
│   └── verify-deployment.sh  # デプロイ検証スクリプト
├── images/                    # プロジェクト画像リソース
│   └── deploy-result.jpg     # デプロイ結果スクリーンショット
├── .github/workflows/        # GitHub Actionsワークフロー
│   ├── build-on-push.yml     # ビルドワークフロー
├── package.json              # Node.jsプロジェクト依存関係とスクリプト
├── pnpm-lock.yaml            # pnpm依存関係ロックファイル
├── tsconfig.json             # TypeScript設定
├── tsconfig.node.json        # Node.js環境TypeScript設定
├── vite.config.ts            # Viteビルド設定（APIプロキシ、PWA対応）
├── tailwind.config.js        # Tailwind CSS設定
├── postcss.config.js         # PostCSS設定
├── .env.development          # 開発環境変数（APIターゲットアドレス）
├── index.html                # メインHTMLファイル（Viteエントリー）
├── README.md                 # プロジェクトメインドキュメント
└── LICENSE                   # ライセンスファイル
```

**説明**：
- プロジェクトはモジュール設計を採用し、関心事の分離が明確です
- API層はすべてのネットワークリクエストを一元管理し、メンテナンスとテストが容易です
- コンポーネントは機能ごとに分類され、windowsコンポーネントはモーダルインタラクションに使用されます
- 国際化設定は一元管理され、多言語切り替えに対応しています
- 状態管理にはVuexの代わりにPiniaを使用しています
- スタイルはTailwind CSSベースで、レスポンシブデザインに対応しています
- 新しい設定ファイルシステムにより動的なページコンテンツ管理が可能
- 新たにPWAに対応し、ページをスタンドアロンアプリとしてインストール可能
- ダークモード、ハイコントラストモードのテーマ切り替えに対応
- 新しいドキュメントセンターでMarkdown形式のドキュメントレンダリングに対応
- Schema構造化データによりSEO最適化
- モバイル端末向け全画面メニュー、スクロールバー対応

- `public/.well-known/` - デジタルアセットリンクファイルディレクトリ、`assetlinks.json`を含む

## クイックスタート

### 環境要件

- **Node.js** >= 16.0.0（18.xまたは20.x LTSを推奨）
- **パッケージマネージャー**: pnpm >= 8.0.0

### 依存関係のインストール

```bash
# pnpmが未インストールの場合、先にインストール（推奨）
npm install -g pnpm

# プロジェクトの依存関係をインストール
pnpm install

# またはnpmを使用（非推奨、依存関係の競合の可能性あり）
# npm install
```

### バックエンドAPIの設定

**重要**: プロジェクトを起動する前に、バックエンドAPIアドレスを設定する必要があります。プロジェクトは2つの設定方法をサポートしています：

#### 1. 開発環境変数設定（ローカル開発に推奨）
`.env.development` ファイルを編集：

```bash
# バックエンドAPIサーバーアドレス（デフォルトはローカル開発アドレス）
VITE_API_TARGET=http://localhost:8080

# Viteプロキシを有効化（開発時に推奨）
VITE_USE_PROXY=true
```

**設定説明**：
- `VITE_API_TARGET`: バックエンドサーバーアドレス。開発時は通常 `http://localhost:8080`
- `VITE_USE_PROXY`: Vite開発プロキシを有効にするかどうか。有効にすると特定のAPIパスがViteを介してバックエンドに転送されます

#### 2. アプリケーション設定ファイル（本番環境に推奨）
`public/config/app.config.json` を編集：

```json
{
  "apiMode": "remote",                    // "local" または "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

**二つの設定の相互作用**：
- **ローカル開発推奨設定**：`apiMode: "local"` + `VITE_USE_PROXY=true` + `VITE_API_TARGET=http://localhost:8080`
- **リモートサーバー接続**：`apiMode: "remote"` + `VITE_USE_PROXY=false`
- **本番環境**：実際のデプロイ先に応じて `apiMode` を設定（フロントエンドビルド後、設定ファイルを変更してターゲットサーバーを切り替え）

**注意**：`VITE_USE_PROXY=true` の場合、開発プロキシが一部の `apiMode` 設定を上書きします。詳細は[API統合](#api統合)の章を参照してください。

### 開発モード

```bash
# 開発サーバーを起動
pnpm dev
# または npm run dev

# アプリケーションは http://localhost:3000 で起動
```

**開発時の注意事項**：
1. **バックエンドが動作していることを確認**：フロントエンド起動前に、バックエンドサーバーが `http://localhost:8080`（または設定したアドレス）で動作していることを確認してください
2. **プロキシ設定**：`VITE_USE_PROXY=true` の場合、APIリクエストは自動的にバックエンドにプロキシされます
3. **ホットリロード**：コードの変更は自動的にページに反映され、開発効率が向上します
4. **コンソール出力**：開発サーバーはビルドエラーとTypeScriptチェック結果を表示します

### プロダクションビルド

```bash
# TypeScript型チェックを実行してビルド（標準SPAモード）
pnpm build
# または npm run build

# ビルド成果物は dist/ ディレクトリに出力されます
```

**ビルド説明**：
- ビルドプロセスでは `vue-tsc` による型チェックが実行され、TypeScriptコードの正確性が保証されます
- プロダクションビルドではコードの最適化、リソースの圧縮、sourcemapの生成が行われます
- ビルド成果物は純粋な静的ファイルで、任意のWebサーバーにデプロイ可能

### SSG（静的サイト生成）バージョンのビルド

```bash
# すべての静的ルートをHTMLファイルとしてプリレンダリング（SSGモード）
pnpm build:ssg
# または npm run build:ssg
```

**SSG説明**：

SSG（Static Site Generation）はビルド時に各ルートを対応する `index.html` ファイルとしてプリレンダリングし、`dist/` ディレクトリに出力します。通常のSPAビルドと比較して、SSGの利点は以下の通りです：

- **SEOの向上**：検索エンジンのクローラーがJSの実行を待たずに完全なHTMLコンテンツを直接取得できます
- **初回表示の高速化**：ユーザーの初回アクセス時にVueのレンダリングを待たずに完全なHTMLを取得できます
- **SNS共有に最適**：各プラットフォームのOpen Graphクローラーがページのメタ情報を正しく解析できます

**プリレンダリングされるルート**（ログインが必要な動的ルートは含まない）：

| ルート | 出力ファイル |
|------|---------|
| `/` | `dist/index.html` |
| `/rooms` | `dist/rooms/index.html` |
| `/chart-ranking` | `dist/chart-ranking/index.html` |
| `/user-ranking` | `dist/user-ranking/index.html` |
| `/agreement` | `dist/agreement/index.html` |
| `/announcement` | `dist/announcement/index.html` |
| `/chart-download` | `dist/chart-download/index.html` |
| `/phira-download` | `dist/phira-download/index.html` |
| `/navigation` | `dist/navigation/index.html` |
| `/about` | `dist/about/index.html` |
| `/docs` | `dist/docs/index.html` |
| `/docs/*` | `dist/docs/*/index.html`（動的生成、docs.config.jsonの設定に基づく） |
| `/404` | `dist/404/index.html` |

> **注意**：
> - `/account` ルートはログイン認証が必要なため、SSGのプリレンダリング対象外で、クライアント側でSPAとしてレンダリングされます。
> - `/docs/*` ルートは動的に生成され、`docs.config.json` の設定に基づいて対応するドキュメントページが生成されます。
> - `/404` ページは存在しないルートの処理に使用されます。

**SSG成果物のデプロイ**：SSGビルド成果物は通常のビルドと完全に互換性があり、同じNginx/Apache設定でデプロイできます。SPAのフォールバックルーティングが正常に動作するよう、`try_files $uri $uri/ /index.html;` を維持する必要があります。

### プロダクションビルドのプレビュー

```bash
# プロダクションビルド結果をローカルでプレビュー
pnpm preview
# または npm run preview

# プレビューサーバーは http://localhost:4173 で起動
```

**プレビュー機能**：
- Viteのプレビューサーバーを使用し、本番環境をシミュレート
- ビルド成果物が正しく動作するか確認
- 本番環境でのAPIプロキシの動作を検証

## 設定説明

### アプリケーション設定 (public/config/app.config.json)

```json
{
  "apiMode": "remote",                    // APIモード: local（ローカル）または remote（リモート）
  "remoteBaseURL": "https://phira.htadiy.com",  // リモートAPIサーバーアドレス
  "localBaseURL": "http://localhost:8080",      // ローカル開発サーバーアドレス
  "routes": {                              // APIルート設定
    "auth": { "login": "/api/auth/login", ... },
    "rooms": { "list": "/api/rooms/info", ... },
    "charts": {
      "rank": "/chart/:id/rank",
      "chartRank": "/topchart/chart_rank/:chart_id",
      "hotRank": "/topchart/hot_rank/:timeRange"  // 注意：完全パス
    },
    "playtime": { "leaderboard": "/rankapi/playtime_leaderboard" }
  },
  "externalAPI": {
    "phiraBaseURL": "https://phira.5wyxi.com"  // 外部Phira APIアドレス
  },
  "background": {
    "defaultImageURL": "https://webstatic.cn-nb1.rains3.com/5712×3360.jpeg"
  }
}
```

### ユーザー設定 (public/config/preferences.config.json)

以下のカスタマイズオプションをサポート：
- テーマカラー
- ぼかしガラス効果の透明度
- 背景パーティクルエフェクト
- 背景画像
- 表示言語

### グローバル設定 (public/config/global.config.json)

グローバル共有情報の設定：
- グローバルPhiraサーバーアドレス
- グローバルQQグループ番号
- ページ内のサーバーアドレスと連絡先情報の統一表示

### ダウンロードページ設定 (public/config/download.config.json)

Phiraダウンロードページの設定：
- 最新バージョン番号（例：v0.6.7）
- ダウンロードカード設定（タイトル、紹介、ボタン文言、ボタンリンクの多言語対応）

### ナビゲーションページ設定 (public/config/navigation.config.json)

ナビゲーションページのカードグループとカードの設定：
- カードグループ（公式、マルチサーバー、コミュニティオープンソースリポジトリ）の多言語名称
- カードの多言語タイトルとリンク

### お知らせページ設定 (public/config/announcement.config.json)

お知らせページのお知らせカード設定：
- お知らせのタイトル、日時、本文の多言語対応
- お知らせの動的追加・修正に対応

### 私たちについてページ設定 (public/config/about.config.json)

私たちについてページの設定：
- チーム紹介文の多言語対応
- チームメンバー情報（名前、アバター、ホームページリンク）
- 謝辞リスト（名前、アバターID、貢献の説明）

### ドキュメントページ設定 (public/config/docs.config.json)

ドキュメントセンターの設定：
- ドキュメントID、ルート名、ページタイトル、メタタグ
- ドキュメントファイルアドレスマッピング
- ドキュメントの動的追加に対応

## API統合

プロジェクトには以下のAPIエンドポイントが事前設定されており、Vite開発プロキシも設定済みです：

### APIエンドポイント設定
- 認証: `/api/auth/*`
- ルーム: `/api/rooms/*`
- ランキング: `/rankapi/playtime_leaderboard`
- 譜面情報: `/chart/*`
- 譜面ランキング: `/topchart/chart_rank/*`
- 譜面ホットランキング: `/topchart/hot_rank/*`（注意：パスは `/topchart/hot_rank/`）
- ユーザーランキング: `/user_rank/*`

### APIモード設定（apiMode）
アプリケーションは2つのAPIモードをサポートしており、`public/config/app.config.json` の `apiMode` で設定します：

```json
{
  "apiMode": "remote",                    // "local" または "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

- **local モード**：APIリクエストは `localBaseURL`（通常はローカル開発サーバー）に送信されます
- **remote モード**：APIリクエストは `remoteBaseURL`（本番サーバー）に送信されます

**注意**：開発環境では、この設定の動作は `VITE_USE_PROXY` 環境変数の影響を受けます：
- `VITE_USE_PROXY=true`（デフォルト）の場合、開発サーバーは特定のパスを `VITE_API_TARGET` にプロキシし、一部の `apiMode` 設定を上書きします
- `VITE_USE_PROXY=false` の場合、`apiMode` 設定が完全に有効になります

### 開発プロキシ設定
`vite.config.ts` に以下のプロキシルールが設定されています（`VITE_USE_PROXY=true` の場合に有効）：

```javascript
proxy: {
  '/api': { target: 'http://localhost:8080' },
  '/rankapi': { target: 'http://localhost:8080' },
  '/chart': { target: 'http://localhost:8080' },
  '/topchart/hot_rank': { target: 'http://localhost:8080' },
  '/topchart/chart_rank': { target: 'http://localhost:8080' },
  '/chart_rank': { target: 'http://localhost:8080' },
  '/user_rank': { target: 'http://localhost:8080' }
}
```

**プロキシとapiModeの相互作用**：
- 開発環境では、Axios APIインスタンスを使用するリクエストはプロキシが介入し、`apiMode` を無視します
- 開発環境では、直接 `fetch()` を使用するリクエストは `apiMode` 設定に従います
- 本番環境では、すべてのリクエストが `apiMode` 設定に従います

### 外部API
一部の機能（譜面詳細、ユーザーアバターなど）は外部Phira API（`https://phira.5wyxi.com`）を直接呼び出します。これらのリクエストはプロキシを経由せず、`apiMode` の影響も受けません。

### 推奨設定
1. **ローカル開発**：`apiMode: "local"`、`VITE_USE_PROXY=true`、`VITE_API_TARGET=http://localhost:8080`
2. **リモートサーバー接続**：`apiMode: "remote"`、`VITE_USE_PROXY=false`
3. **本番環境**：デプロイ先に応じて `apiMode` を `local` または `remote` に設定

## デプロイ

### Nginx設定例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 圧縮最適化

プロジェクトビルド時には自動的に Brotli (`.br`) と Gzip (`.gz`) 圧縮ファイルが生成されます。サーバー側で事前圧縮ファイルを有効にするには、Nginx設定を更新してください：

```nginx
# http または server ブロックに以下の設定を追加
gzip_static on;          # 事前圧縮された .gz ファイルを有効化
brotli_static on;        # 事前圧縮された .br ファイルを有効化（ngx_brotli モジュールが必要）
gzip_vary on;            # Vary: Accept-Encoding レスポンスヘッダーを追加

# ngx_brotli モジュールがインストールされていない場合、動的圧縮を有効化
# gzip on;
# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
# brotli on;
# brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

完全なNginx設定例（事前圧縮ファイル対応）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 圧縮最適化設定
    gzip_static on;
    brotli_static on;
    gzip_vary on;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**注意**：
- 事前圧縮ファイルは `vite-plugin-compression` によってビルド時に生成され、リアルタイムの圧縮オーバーヘッドはありません
- Nginxが `--with-http_gzip_static_module` および `--add-module=/path/to/ngx_brotli`（Brotli対応の場合）を含んでコンパイルされていることを確認してください
- ブラウザは `Accept-Encoding` リクエストヘッダーに基づいて自動的に適切な圧縮形式を受信します

## 開発ガイド

### 新しいページの追加

1. `src/views/` に新しいVueコンポーネントを作成
2. `src/router/index.ts` にルート設定を追加
3. `Header.vue` の `navRoutes` 配列にナビゲーションリンクを追加

### 新しいAPIの追加

1. `src/api/` に対応するAPIモジュールを作成
2. `src/types/index.ts` に関連する型を定義
3. コンポーネントにインポートして使用

### カスタムスタイル

- グローバルスタイル: `src/styles/main.css`
- Tailwind設定: `tailwind.config.js`
- テーマカラーはCSS変数 `--primary-color` で制御

## ブラウザサポート

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 効果
[HSNPhira公式サイト](https://phira.htadiy.com/) でデプロイ結果を確認できます。
![デプロイ完了後のトップページ](https://github.com/HyperSynapseNetwork/HSNPhira/blob/frontend-remake/images/deploy-result.jpg?raw=true)

## ライセンス

本プロジェクトは GNU Affero General Public License（AGPL）3.0 オープンソースライセンスの下で提供されています。

### 著作権表示
著作権表示 (C) HyperSynapse Network。All rights reserved.

### 開発者の義務
AGPL-3.0 ライセンスに基づき、本プロジェクトを使用、変更、または配布する開発者は以下を遵守する必要があります：
- 元のプロジェクトの著作権およびライセンス表示を保持すること。
- 配布時に完全なソースコードを提供すること。
- 本プロジェクトに基づく派生作品もAGPL-3.0ライセンスでオープンソース化すること。

詳細な条項については [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html) ライセンス全文をご参照ください。

## 連絡先

- QQグループ: 1049578201
- メール: nb3502022@outlook.com
- GitHub: https://github.com/HyperSynapseNetwork/HSNPhira

## 謝辞

本プロジェクトに貢献してくださった皆様に感謝します。皆様がいなければ本プロジェクトの現在はありません（順不同、遗漏がありましたら申し訳ございません）：

### 開発貢献
以下の開発者のプロジェクト開発、テスト、資金提供への貢献に感謝します：
*   **[TeamFlos](https://github.com/TeamFlos)**
    *   原作 **Phira**：[Phira](https://github.com/TeamFlos/Phira)
    *   原作 **Phira-MP**：[Phira-MP](https://github.com/TeamFlos/Phira-MP)
*   **[htadiy](https://github.com/htadiy)**
*   **[ExplodingKonjac](https://github.com/ExplodingKonjac)**
*   **[LY-Xiang](https://github.com/LY-Xiang)**
*   **[AFewSuns](https://github.com/AFewSuns)**

### デザイン、資金提供とサポート
*   **Ght/F=1** 氏には本プロジェクトのアイコンデザインにご参加いただきました。 **[Dmocken](https://github.com/Dmocken)** 氏には本プロジェクトの宣伝とサーバーステータス監視のサポートを提供いただきました。
*   **本プロジェクトを支援してくださった全ての寄付者の皆様**に感謝します。
*   **HSNPhiraのサービスを利用した全てのプレイヤーの皆様**に感謝します。

### コミュニティ貢献
Phiraオープンソースコミュニティエコシステムに貢献してくださった全ての開発者に感謝します！

### 特別感謝
**Claude** と **Deepseek** の本プロジェクトへのサポートに感謝します。
**雨雲** の本プロジェクトへのサポートに感謝します。
