# HSN Phira Web Monitor

これは Phira 向けに設計された完全な Web ベースのツールチェーンで、リアルタイムのマルチプレイ観戦、ユーザー同期、ルーム検索機能を提供します。

本プロジェクトは主に Phira マルチプレイルームのプロキシおよび Web 可視化レイヤーとして機能し、ユーザーがブラウザ上で直接リアルタイムレンダリングされた譜面を観戦できるようにします。

## アーキテクチャ概要

本プロジェクトは連携して動作する 4 つの主要ワークスペースで構成されています：

1. **`monitor-common`**：ネットワーク層と WebGL レンダラー間で使用される共有 Rust データ構造、バイナリ解析ツール、コアロジックを定義します。
2. **`monitor-proxy`**：Rust Axum ベースのサーバーで、公式 Phira サーバーとブラウザクライアント間のブリッジとして機能します。ユーザー認証（JWT）、ルーム一覧のポーリング、リモート判定イベントのストリーミング（SSE）、譜面バイナリファイルの提供を担当します。
3. **`monitor-client`**：本プロジェクトの WebAssembly（WASM）コアです。Rust で記述され、`bincode` 譜面データをデコードし、WebGL ネイティブ計算を使用して Phira 譜面をレンダリングします。
4. **`web`**：モダンな Vue 3 + TypeScript フロントエンドアプリケーションです。UI 状態を管理し、WebSocket および SSE イベントリスナーを確立し、オーディオコンテキスト（AudioContext）を調整し、WASM WebGL エンジン用のキャンバスサイズを動的に管理します。

---

## コンポーネント詳細と API リファレンス

### `monitor-proxy`

アプリケーションのメインバックエンドとして機能するプロキシサーバーです。

#### データ形式定義

すべてのインターフェースは以下の TypeScript インターフェース定義を基本とします：

```typescript
// === 認証とユーザー情報関連 (Auth) ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  phira_avatar: string | null;
  phira_id: number;
  phira_rks: number;
  phira_username: string;
  register_time: string; // ISO 8601 形式の時刻文字列
  last_login_time: string; // ISO 8601 形式の時刻文字列
}

// === ルーム情報および一覧関連 (Rooms) ===

export interface RoomListResponse {
  total: number; // ルーム総数
  rooms: RoomInfoResponse[]; // ルーム詳細情報一覧
}

export interface RoomInfoResponse {
  name: string; // ルーム ID 識別子
  data: RoomData;
}

export interface RoomData {
  host: number; // ホスト ID（-1 はホストなし）
  users: number[]; // ルーム内ユーザー ID 一覧
  lock: boolean; // ロック中かどうか
  cycle: boolean; // ホスト交代モードかどうか
  chart: number | null; // 選択中の譜面 ID（null は未選択）
  state: "SELECTING_CHART" | "WAITING_FOR_READY" | "PLAYING"; // ルーム状態
  rounds: RoundData[]; // ルーム履歴対局一覧
}

export interface RoundData {
  chart: number; // 該当対局の譜面 ID（-1 はなし）
  records: RecordData[]; // 該当対局のプレイヤー成績一覧
}

export interface RecordData {
  id: number;
  player: number;
  score: number;
  perfect: number;
  good: number;
  bad: number;
  miss: number;
  max_combo: number;
  accuracy: number; // 例：1.0 は 100%
  full_combo: boolean;
  std: number;
  std_score: number;
}

// === 過去訪問ユーザー関連 (Visited Users) ===

export interface VisitedUserListResponse {
  count: number; // 総訪問ユーザー数
  users?: VisitedUserInfo[]; // ユーザー一覧（count_only が false の場合のみ返される）
}

export interface VisitedUserInfo {
  phira_id: number;
}
```

SSE（`GET /rooms/listen`）のイベント定義：

```typescript
// === SSE ルーム監視イベント (SSE) ===

// ルーム作成イベント
export interface SSEEventCreateRoom {
  room: string;
  data: RoomData;
}

// ルーム状態更新イベント
export interface SSEEventUpdateRoom {
  room: string;
  data: Partial<RoomData>; // データ更新（存在しない場合、フロントエンドはルーム作成と解釈可能）
}

// プレイヤー参加・退出イベント
export interface SSEEventJoinOrLeaveRoom {
  room: string;
  user: number;
}

// 新対局結果を含む
export interface SSEEventNewRound {
  room: string;
  round: RoundData;
}
```

#### `GET /chart/{id}`

**説明**：指定された `id` の譜面バイナリデータを取得し、`monitor-client` でのデコードに使用します。

**レスポンス形式**：`application/octet-stream`。

#### `GET /rooms/info`

**説明**：現在の全アクティブルームの一覧を取得します。

**レスポンス形式**：`application/json`、形式は `RoomListResponse`。

#### `GET /rooms/info/{id}`

**説明**：指定された `id` のルーム詳細情報を取得します。

**レスポンス形式**：`application/json`、形式は `RoomInfoResponse`。

#### `GET /rooms/user/{id}`

**説明**：指定ユーザー（ID）が現在所属しているルームを照会します。

**レスポンス形式**：`application/json`、形式は `RoomInfoResponse`（どのルームにも所属していない場合は `null`）。

#### `GET /visited`

**説明**：このサーバーでルームを作成または参加したことのあるユーザー情報を取得します。

**クエリパラメータ**：
- `count_only`: (オプション, boolean) 総数のみを返すかどうか。デフォルトは `false`。

**レスポンス形式**：`application/json`、形式は `VisitedUserListResponse`。

#### `GET /rooms/listen`

**説明**：ルームライフサイクルイベントを監視するための Server-Sent Events（SSE）ストリームです。

**レスポンス形式**：`text/event-stream`。

含まれるイベントタイプ：

- `create_room`: `SSEEventCreateRoom` 構造の JSON データを送信します。SSE 接続確立時に、サーバーは現在の全ルーム状態を示す複数の `create_room` イベントを直ちに送信します。
- `update_room`: `SSEEventUpdateRoom` 構造の JSON データを送信します。
- `join_room`: `SSEEventJoinOrLeaveRoom` 構造の JSON データを送信します。
- `leave_room`: `SSEEventJoinOrLeaveRoom` 構造の JSON データを送信します。
- `new_round`: `SSEEventNewRound` 構造の JSON データを送信します。

#### `POST /auth/login`

**説明**：公式 Phira 認証インターフェースにプロキシするログインエンドポイントです。成功すると JWT Token を返し、フロントエンドはこの Token を保存して後続の認証リクエストに使用します。

**リクエスト形式**：`application/json`、形式は `LoginRequest`。

**レスポンス形式**：`application/json`、形式は `LoginResponse`。

#### `GET /auth/me`

**説明**：現在の JWT Token に対応するユーザープロファイルデータ（Phira ネイティブデータのキャッシュ）を取得します。リクエストヘッダーに `Authorization: Bearer <token>` を含める必要があります。

**レスポンス形式**：`application/json`、形式は `ProfileResponse`。

---

## 開発ガイド

本プロジェクトをローカルで開発するには、**Rust**、**Node.js (v18+)**、および **wasm-pack** がインストールされていることを確認してください。

1. **WASM クライアントのコンパイル：**

```bash
cd monitor-client
wasm-pack build --out-dir ../web/pkg --target web
```

2. **フロントエンドの実行 (Vue)：**

```bash
cd web
npm install
npm run dev
```

3. **プロキシバックエンドの実行：**

_(ローカル開発用の secret key を事前に設定してください)_

```bash
export HSN_SECRET_KEY=dev_secret_local
cargo run --bin monitor-proxy -- --debug
```

---

## プロダクションデプロイガイド

HSN Phira Proxy のデプロイには、静的な WebAssembly/Vue 成果物のコンパイルと、Rust サーバーの安全な実行が必要です。

### 前提条件

- ビルドツール：`rustc`、`cargo`、`npm`、`wasm-pack`。
- Web サーバー（Nginx または Caddy など）。静的ウェブページのホスティングとリバースプロキシに使用します。

### 1. WASM エンジンのコンパイル

**この手順は最初に実行する必要があります**。Vue のビルドは `pkg/` フォルダに出力される WASM モジュールに依存しているためです。

```bash
cd monitor-client
wasm-pack build --target web --out-dir ../web/pkg --release
```

### 2. 静的 Web フロントエンドのコンパイル

Vue 3 アプリケーションを標準の HTML/JS 静的ファイルにコンパイルします。

#### 環境変数設定 (.env)

`web` ディレクトリでフロントエンドの環境変数を設定します。本番環境では、ビルド前に `.env.production` ファイルを作成または変更できます：
フロントエンドとバックエンドを別々のドメインでデプロイする場合（API バックエンドがウェブページと同じドメインでホストされていない場合）、フロントエンドがプロキシバックエンドにアクセスするための API ルート URL を指定する必要があります：

```env
# 例：プロキシバックエンドの外部アクセス URL
VITE_API_BASE=https://api.yourdomain.com
```

_注：設定しない場合や空文字列 `""` の場合は、フロントエンドは自動的にリクエストを現在のウェブページと同じオリジンの相対パスに送信します（これは Nginx で統一リバースプロキシを行う場合に最適です）。_

```bash
cd web
npm ci
npm run build
```

コンパイル後に最適化されたフロントエンドファイルは `web/dist` に出力されます。

### 3. API プロキシバックエンドのコンパイルと実行

リリースモードで Rust バイナリをネイティブコンパイルし、最高のパフォーマンスを実現します。

```bash
cargo build --release --bin monitor-proxy
```

#### 起動オプションガイド

`monitor-proxy` は以下のコマンドライン引数をサポートしており、`--help` で確認できます：

- `--debug`: デバッグモードを有効にします。有効にすると CORS セキュリティポリシーが緩和されます。
- `--port <PORT>`: サーバーのリッスンポート（デフォルトは `3080`）。
- `--cache-dir <DIR>`: 譜面のハードディスク上のキャッシュダウンロードディレクトリ（デフォルトは `~/.cache/hsn-phira`）。
- `--api-base <URL>`: Phira 公式 API のフェッチ先アドレス（デフォルトは `https://phira.5wyxi.com`）。
- `--mp-server <ADDR>`: Phira マルチプレイヤーゲームサーバーアドレス。ルーム情報の取得に使用（デフォルトは `localhost:12346`）。
- `--allowed-origin <ORIGIN>`: **本番環境では必須です**。クロスオリジンリソース共有（CORS）の許可元ドメインを明示的に設定します（例：`https://monitor.example.com`）。この設定を行わないとプログラムは起動しません（`--debug` を有効にしている場合を除く）。

#### 環境変数

Rust サーバーは、ユーザートークン生成時の暗号化セキュリティと、phira-mp サーバーとの通信時の認証のために Secret Key が必要です。プロセス起動前に**必ず定義する必要があり**、**phira-mp で設定したものと同じである必要があります**。

```bash
export HSN_SECRET_KEY=$(openssl rand -hex 32)
```

サーバーの起動（systemd や PM2 などのデーモン管理ツールを使用したバックグラウンド管理と、本番用パラメータの指定を推奨）：

```bash
./target/release/monitor-proxy --port 8080 --allowed-origin https://monitor.example.com
```

### 4. リバースプロキシ設定（Nginx の例）

Web サーバーが Vue 静的パッケージを効率的にホストし、REST API、SSE、WebSocket トラフィックをバックエンドの Rust サーバーに正しくプロキシするように設定します。

```nginx
server {
    listen 80;
    server_name monitor.example.com;

    # Vue 3 静的成果物のホスティング
    location / {
        root /path/to/hsn-phira/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # REST API、SSE ストリーム、WebSocket リクエストを Rust サーバーに統一プロキシ
    location /api/ {
        proxy_pass http://127.0.0.1:8080/; # 実際の PORT 設定に応じて調整
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # WebSocket の Upgrade リクエストヘッダー設定
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        # SSE ストリーム（例：/rooms/listen）の場合、切断/遅延を防ぐためにバッファリングを無効化
        proxy_buffering off;
        proxy_read_timeout 86400; # 長時間接続の切断を防止
    }
}
```
