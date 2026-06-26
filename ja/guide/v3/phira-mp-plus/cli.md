# Phira-mp+ CLI コマンドドキュメント

## 起動パラメータ

```
phira-mp-plus-server [OPTIONS]

  -p, --port <PORT>          サーバーリッスンポート [デフォルト: 12346]
  -d, --plugins-dir <DIR>    WASM プラグインディレクトリパス [デフォルト: "plugins"]
  -e, --ext-file <FILE>      拡張データ永続化 JSON ファイルパス [デフォルト: "data/extensions.json"]
      --no-cli               対話型 CLI 管理コンソールを無効化
  -l, --log-file <NAME>      ログファイルのベース名 [デフォルト: "phira-mp-plus"]
  -m, --monitor <IDS>...     観戦を許可するユーザー ID（複数指定可能、例：`-m 1 -m 2`）
      --http-port <PORT>     HTTP/SSE サービスポート [デフォルト: 12347]
  -c, --config <FILE>        YAML 設定ファイルパス [デフォルト: "server_config.yml"]
  -h, --help                 ヘルプ情報を表示
  -V, --version              バージョン番号を表示
```

設定の読み込み順序（後が優先）：YAML 設定ファイル < 環境変数 < CLI パラメータ。

## 対話型管理コンソール

サーバーは通常の対話型ターミナルおよび tmux 上で ratatui 管理コンソールを起動します。GNU Screen 環境では自動的にライン単位の互換コンソールに切り替わり、色、代替画面、マウス、Bracketed Paste 制御シーケンスは出力されません。リダイレクト、systemd、その他の非 TTY 環境でもライン単位のコンソールが使用されます。`NO_COLOR` を設定すると、他のターミナルでも色を無効化できます。

### コマンド一覧

#### 一般コマンド

| コマンド | エイリアス | 説明 |
|------|------|------|
| `help` | `h`, `?` | ヘルプ情報を表示 |
| `exit` | `quit`, `q` | サーバーを終了 |
| `status` | `st` | サーバーステータスを表示 |

#### プラグイン管理（WASM）

| コマンド | 説明 |
|------|------|
| `plugin list` | ロード済みの全 WASM プラグインを一覧表示 |
| `plugin enable <名前>` | 指定プラグインを有効化 |
| `plugin disable <名前>` | 指定プラグインを無効化 |
| `plugin info <名前>` | プラグインの詳細情報を表示 |
| `plugin reload` | 全 WASM プラグインをリロード |

#### ユーザー管理

| コマンド | 説明 |
|------|------|
| `users` | オンラインユーザーを一覧表示 |
| `kick <ユーザーID>` | サーバーからユーザーをキック |
| `kick <ルームID> <ユーザーID>` | ルームからユーザーをキック |
| `broadcast [スコープ] <メッセージ>` | メッセージをブロードキャスト |

##### broadcast スコープ

```
broadcast all <メッセージ>             すべてのユーザーにブロードキャスト
broadcast room <ルームID> <メッセージ>    指定ルームにブロードキャスト
broadcast user <ユーザーID> <メッセージ>   指定ユーザーに送信
```

#### ルーム管理（room サブコマンド）

| コマンド | 説明 |
|------|------|
| `rooms` / `room list` | アクティブルームを一覧表示 |
| `room info <ルームID>` | ルーム詳細（状態、ホスト、譜面、履歴） |
| `room start <ルームID>` | ゲームを強制開始 |
| `room cancel <ルームID>` | 準備状態をキャンセル |
| `room kick <ルームID> <ユーザーID>` | ルームからユーザーをキック |
| `room transfer <ルームID> <ユーザーID>` | ホストを移譲 |
| `room set <ルームID> <フィールド> <値>` | ルーム設定を変更（lock/cycle/chart-id） |
| `room close <ルームID>` | ルームを解散 |
| `room history <ルームID>` | プレイ記録を表示 |
| `room ban <ルームID> <ユーザーID>` | ルームのブラックリストに追加 |
| `room unban <ルームID> <ユーザーID>` | ルームのブラックリストから削除 |
| `room banlist <ルームID>` | ルームのブラックリスト一覧 |

旧エイリアス互換：`rooms`, `room-info` / `ri`, `room-start` / `rs`, `room-cancel` / `rc`,
`room-transfer` / `rt`, `room-history` / `rh`, `close-room` / `cr`,
`room-ban` / `rb`, `room-unban` / `ru`, `room-banlist` / `rbl`

#### ブラックリスト管理

| コマンド | 説明 |
|------|------|
| `ban <ユーザーID> [理由]` | ユーザーを BAN |
| `unban <ユーザーID>` | ユーザーの BAN を解除 |
| `banlist` | BAN 一覧を表示 |

#### 拡張データ

| コマンド | 説明 |
|------|------|
| `ext-list` | 登録済みの全拡張データフィールドを一覧表示 |
| `ext-get <ID> <key>` | 指定ユーザー/ルームの拡張データを取得 |

## Web API

中央 HTTP/SSE サーバーは設定された `--http-port`（デフォルト 12347）でリッスンします。

| エンドポイント | 説明 |
|------|------|
| `GET /api/rooms` | ルーム一覧（詳細含む） |
| `GET /api/rooms/{name}` | 指定ルームの情報 |
| `GET /api/user_name/{id}` | ユーザー名照会 |
| `GET /api/players/count` | オンラインプレイヤー数 |
| `GET /api/events` | 統合 SSE エンドポイント |
| `GET /rooms/listen` | SSE ルームイベントストリーム（web-monitor 互換） |
| `GET /ws/live` | WebSocket リアルタイム監視（web-monitor 互換） |

詳細な API ドキュメントは [api.md](api.md) を参照してください。

## WASM プラグインシステム

サーバーは wasmtime を介して `.wasm` プラグインのロードをサポートします。プラグインは `plugins/` ディレクトリに配置します（`-d` でカスタマイズ可能）。
プラグインは `phira:host/api` インポート関数を介してサーバーの全機能にアクセスできます：

- 状態照会：rooms.list, player.touches, round.data など
- メッセージ送信：send.to_user, send.to_room, send.to_all
- ルーム管理：room.kick, room.transfer_host, room.set_lock, room.close
- ユーザー管理：admin.kick_user, admin.ban_user, admin.unban_user, admin.is_banned
- プラグイン間呼び出し：plugin.api_call, plugin.api_register
- データ読み書き：ext.get/set, config.get/set, file.read/write
- HTTP リクエスト：http.get/post

具体的なインターフェース定義は `wit/phira/mpplus.wit` を参照してください。

## ログファイル

ログファイルは `log/` ディレクトリに保存され、1時間ごとにローテーションされます。

ログレベルは `RUST_LOG` 環境変数で制御します：

```bash
RUST_LOG=info phira-mp-plus-server
RUST_LOG=debug phira-mp-plus-server
```
