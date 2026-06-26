# Phira-mp + プロジェクト概要

## プロジェクト構造

```
Phira-mp-plus/
│
├── Cargo.toml                   # ワークスペースルート
├── Cargo.lock
├── LICENSE                      # AGPL-3.0
├── README.md
│
├── server_config.yml            # YAML設定ファイル（初回実行時にデフォルトテンプレートを自動生成）
├── data/                        # 実行時データディレクトリ
│   ├── extensions.json          #   プラグイン拡張データの永続化
│   ├── rounds/                  #   ラウンドのTouches/Judges記録
│   └── plugins/                 #   プラグインのプライベートデータ
├── log/                         # 実行ログ（毎時間ローテーション）
│
├── phira-mp-plus-server/        # サーバーコア
│   ├── Cargo.toml               #   axum / tokio / wasmtime / clap などの依存関係
│   ├── locales/                 #   Fluent i18n 翻訳ファイル
│   │   ├── en-US.ftl
│   │   ├── zh-CN.ftl
│   │   └── zh-TW.ftl
│   └── src/
│       ├── main.rs              #   プロセスエントリとライフサイクル
│       ├── logging.rs           #   tracing出力とログローテーション
│       ├── terminal.rs          #   端末能力検出とScreen縮退戦略
│       ├── lib.rs               #   モジュールエクスポート
│       ├── server.rs            #   サーバーコア: PlusConfig / PlusServerState / PlusServer
│       │                        #     acceptループ、ベンチマーク、状態問合せディスパッチ
│       ├── session.rs           #   セッション管理: Session / User モデル、認証、コマンド処理
│       │                        #     Touches/Judgesデータをプラグインイベント＋ディスク保存へ
│       ├── room.rs              #   ルームステートマシン: InternalRoomState / Room
│       │                        #     選曲→準備→プレイ→決済、プレイヤーリアルタイムデータキャッシュ
│       ├── plugin.rs            #   プラグインマネージャー + WASMホスト: PluginManager / PluginHost
│       │                        #     プラグインロード、イベント配信、CLI/HTTP/API登録
│       ├── plugin_http.rs       #   HTTPサービスの組み立てと動的リクエストディスパッチ
│       ├── plugin_http/
│       │   ├── router.rs        #   動的ルーティングマッチング
│       │   ├── sse.rs           #   SSEイベントバス、スナップショットとストリーム変換
│       │   └── websocket.rs     #   リアルタイムWebSocketブリッジ
│       ├── wasm_host.rs         #   WASMランタイム: wasmtimeインスタンス、JSON ABI、host/apiブリッジ
│       ├── extensions.rs        #   拡張データシステム: ユーザー/ルームKVストア + authキャッシュ永続化
│       ├── ban.rs               #   ブラックリストシステム: グローバルBAN + ルームブラックリスト
│       ├── round_store.rs       #   ラウンドデータ保存: JSONL形式、round_uuid/player_idで整理
│       ├── rate_limiter.rs      #   レート制限: スライディングウィンドウ（接続）+ トークンバケット（コマンド）
│       ├── cli.rs               #   CLIコマンドハンドラ: 30+ 管理コマンド、プラグイン拡張コマンド
│       ├── cli_tui.rs           #   TUI端末インターフェース: ratatui + crossterm
│       └── l10n.rs              #   ローカライゼーション: Fluent Bundle / tl! マクロ
│
├── phira-mp-plus-server-api/    # WASMプラグイン共有型クレート
│   └── src/lib.rs               #   PluginEvent / PluginInfo / HttpHandle
│                                #   ServerStateQuery / PluginApiHandler
│
├── phira-mp/                    # 上流phira-mpサブモジュール（プロトコル層とオリジナルサーバー）
│   ├── phira-mp-common/         #   ネットワークプロトコル: バイナリエンコーディング (BinaryData trait)、
│   │   └── src/                 #     コマンド定義 (ClientCommand / ServerCommand)、
│   │       ├── lib.rs           #     Streamフレームプロトコル、RoomId / RoomState / メッセージ型
│   │       ├── command.rs
│   │       ├── bin.rs           #     BinaryReader / BinaryWriter (LEB128, リトルエンディアン)
│   │       └── framing.rs       #     パック/アンパック (VARINT長さプレフィックス)
│   ├── phira-mp-macros/         #   #[derive(BinaryData)] プロシージャルマクロ
│   ├── phira-mp-server/         #   オリジナルスタンドアロンサーバー (reference)
│   └── phira-mp-client/         #   TCPクライアントライブラリ (ゲーム統合用)
│
├── docs/                        # ローカルドキュメント
│   ├── cli.md                   #   CLIコマンドリファレンス
│   └── plugin-dev.md            #   WASMプラグイン開発ガイド + WIT APIリファレンス
│
└── server_config.yml            # YAML設定ファイル (ランタイムコピー)
```

## 端末互換性

起動時に stdin/stdout、`TERM`、`STY`、`TMUX` を検出します。GNU Screen は自動的に行単位の互換コンソールに切り替わり、色、代替画面、マウスキャプチャ、Bracketed Paste を無効化します。tmux では完全な TUI を使用できます。また `NO_COLOR` に従い、行単位出力では残りの制御シーケンスもフィルタリングされます。非対話環境でも行単位コンソールが使用されます。

## SSE ルームイベント

`GET /rooms/listen` に接続すると、まず `ready` が送信され、次に現在のルームスナップショットが `update_room` として再生され、その後 `create_room`、`update_room`、`join_room`、`leave_room`、`new_round` が継続的にプッシュされます。以下のコマンドでデータストリームを確認できます：

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

## ビルドフィーチャー

| フィーチャー | 説明 | デフォルト |
|-------------|------|-----------|
| `plugin-system` | WASMプラグインサポート（wasmtime） | はい |

## 設定リファレンス

完全な設定項目については `server_config.yml` を参照してください：

| 設定項目 | 型 | デフォルト値 | 説明 |
|---------|------|------------|------|
| `port` | u16 | `12346` | TCP リッスンポート |
| `http_port` | u16 | `12347` | HTTP/SSE サービスポート |
| `monitors` | Vec\<i32\> | `[2]` | 観戦を許可するユーザーID |
| `phira_api_endpoint` | String | `https://phira.5wyxi.com` | Phira API エンドポイント |
| `plugins_dir` | String | `plugins` | プラグインディレクトリ |
| `chat_enabled` | bool | `true` | チャット機能のオン/オフ |
| `cli_enabled` | bool | `true` | CLIコンソールのオン/オフ |
| `connection_rate_limit` | u32 | `30` | 接続レート制限（ウィンドウ内の許可回数） |
| `connection_rate_window` | u32 | `10` | 接続レート統計ウィンドウ（秒） |
| `max_users_per_room` | usize | `8` | ルームあたりの最大プレイヤー数 |
| `round_data_retention_days` | u32 | `7` | ラウンドのTouches/Judges保持日数（0=保持しない） |
| `server_name` | String | — | サーバー名 |
