# Phira-mp+ API ドキュメント

## HTTP API（ポート 12347）

すべての HTTP API は `plugin_http` を通じて提供され、JSON リクエスト/レスポンスをサポートします。

### ルーム情報

#### `GET /api/rooms`
すべてのアクティブルーム一覧とサーバー統計を返します。

**レスポンス：** `200 OK` JSON
```json
{
  "rooms": [
    {
      "name": "room1",
      "host": 16,
      "users": [16, 17],
      "lock": false,
      "cycle": false,
      "chart": 12345,
      "state": "SELECTING_CHART",
      "rounds": []
    }
  ],
  "player_count": 5,
  "total_players": 42
}
```

| フィールド | 説明 |
|------|------|
| `rooms` | アクティブルーム一覧 |
| `player_count` | 現在のオンラインプレイヤー数 |
| `total_players` | これまでサーバーに接続した総プレイヤー数 |

#### `GET /api/rooms/<name>`
指定されたルームの詳細を返します。

**パラメータ：** `<name>` — ルーム名（URL パス）

**レスポンス：** `200 OK` JSON
```json
{
  "host": 16,
  "users": [16, 17],
  "lock": false,
  "cycle": false,
  "chart": 12345,
  "state": "SELECTING_CHART",
  "rounds": []
}
```

#### `GET /api/user_name/<id>`
Phira ID からユーザー名を取得します。

**パラメータ：** `<id>` — Phira ユーザー ID

**レスポンス：** `200 OK`
```
ユーザー名
```

#### `GET /api/players/count`
現在のオンラインプレイヤー数を取得します。

**レスポンス：** `200 OK`
```json
{"count": 5}
```

#### `GET /api/players/all`
これまでサーバーに接続した全プレイヤーの ID 一覧を取得します。

**レスポンス：** `200 OK`
```json
{
  "total": 42,
  "players": [16, 17, 18, 19]
}
```

### SSE イベント

#### `GET /api/events`

統合イベントストリーム。接続確立後に即座に `ready` が送信され、ルームライフサイクルイベントもこのストリームに流れます。

#### `GET /rooms/listen`

ルームイベントストリーム。接続確立時の送信順序は以下の通りです：

1. `ready`：ストリームが確立されたことを示します；
2. 既存の各ルームに対応する `update_room` スナップショット；
3. 以降のルームイベントが継続的に送信されます。

イベントデータは `phira-web-monitor` のルームイベント構造と一致します：

- `create_room`：`{ "room": string, "data": RoomData }`
- `update_room`：`{ "room": string, "data": PartialRoomData | RoomData }`
- `join_room`：`{ "room": string, "user": number }`
- `leave_room`：`{ "room": string, "user": number }`
- `new_round`：`{ "room": string, "round": RoundData }`
- `stream_lagged`：コンシューマーがブロードキャストバッファに追いついていない、`skipped` は破棄されたイベント数

検証コマンド：

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

現在ルームがなくても、keep-alive コメントだけでなく、即座に `event: ready` が表示されるはずです。レスポンスには `Cache-Control: no-cache` と `X-Accel-Buffering: no` が含まれており、一般的なリバースプロキシによるイベントストリームのバッファリングを防ぎます。

### WebSocket

#### `GET /ws/live`
リアルタイムゲームデータ WebSocket（web-monitor 互換）。

---

## CLI コマンド

TUI または stdin CLI で以下のコマンドを入力します：

### システムコマンド

| コマンド | 説明 |
|------|------|
| `help` | すべての使用可能なコマンドを表示 |
| `exit` / `quit` | サーバーを終了 |
| `benchmark [dur_s=30] [rooms=100]` | ストレステスト |

### ルーム管理

| コマンド | 説明 |
|------|------|
| `rooms` / `r` | すべてのルームを一覧表示 |
| `room info <id>` / `room i <id>` | ルーム詳細を表示 |
| `room kick <id> <user_id>` | ユーザーをキック |
| `room close <id>` | ルームを閉じる |
| `room transfer <id> <user_id>` | ホストを移譲 |
| `room set <id> <フィールド> <値>` | ルーム設定を変更（lock/cycle 等） |
| `room history <id>` | ルームプレイ履歴（非推奨の round-last の代替） |
| `room uuid <id>` | ルーム UUID |
| `room ban <id> <user_id>` | ユーザーをブラックリストに追加 |
| `room unban <id> <user_id>` | ブラックリストから削除 |
| `room banlist <id>` | ルームのブラックリスト |

### プレイヤー管理

| コマンド | 説明 |
|------|------|
| `users` / `u` | すべてのオンラインプレイヤーを一覧表示 |
| `user-rooms <user_id>` / `rh <user_id>` | プレイヤーのルーム訪問履歴 |
| `ban <user_id> [reason]` | ユーザーを BAN |
| `unban <user_id>` | ユーザーの BAN を解除 |
| `kick <user_id>` | ユーザーをキック |
| `pardon <user_id>` | BAN 解除 |

### プレイ統計

| コマンド | 説明 |
|------|------|
| `playtime <user_id>` | ユーザーのプレイ時間を照会 |
| `player-count` | プレイしたことのある総プレイヤー数 |
| `room history <room_id>` | ルームのプレイ記録を表示（非推奨の round-last の代替） |

### ウェルカムメッセージ

| コマンド | 説明 |
|------|------|
| `welcome-config` | ウェルカムメッセージ設定とプレースホルダーを表示 |

### プレースホルダー（ウェルカムメッセージテンプレート）

| プレースホルダー | 説明 |
|--------|------|
| `[user_name]` | ユーザー名 |
| `[user_id]` | Phira ID |
| `[player-count]` | 現在のオンライン数 |
| `[players]` | 同上 |
| `[time]` | Unix タイムスタンプ |
| `[playtime]` | 該当ユーザーのプレイ時間 |
| `[playtime <id>]` | 指定ユーザーのプレイ時間 |
| `[top_playtime]` | プレイ時間ランキング（トップ10） |
| `[active_rooms]` | アクティブルームの詳細 |

---

## TCP バイナリプロトコル（ポート 12346）

Phira ゲームクライアントと通信するためのバイナリプロトコルです。カスタムバイナリ形式（`BinaryData` derive）を使用します。詳細は `phira-mp-common` を参照してください。

### 接続フロー

1. クライアントがバージョンバイト（1）を送信
2. クライアントが `Authenticate { token: Varchar<32> }` を送信
3. サーバーが `Authenticate(Ok((UserInfo, Option<ClientRoomState>)))` を返信
4. ハートビート：クライアントは 3 秒ごとに `Ping` を送信、サーバーは `Pong` で応答

### クライアントコマンド

| コマンド | 説明 |
|------|------|
| `Ping` | ハートビート |
| `Authenticate { token }` | 認証 |
| `Chat { message }` | チャットメッセージを送信 |
| `Touches { frames }` | タッチデータ |
| `Judges { judges }` | 判定データ |
| `CreateRoom { id }` | ルームを作成 |
| `JoinRoom { id, monitor }` | ルームに参加 |
| `LeaveRoom` | ルームから退出 |
| `LockRoom { lock }` | ルームをロック/アンロック |
| `CycleRoom { cycle }` | サイクルモード |
| `SelectChart { id }` | 譜面を選択 |
| `RequestStart` | 開始をリクエスト |
| `Ready` | 準備完了 |
| `CancelReady` | 準備完了をキャンセル |
| `Played { id }` | プレイ完了 |
| `Abort` | 中断 |
| `QueryRoomInfo` | ルーム一覧を照会 |

### サーバーコマンド

| コマンド | 説明 |
|------|------|
| `Pong` | ハートビート応答 |
| `Authenticate(...)` | 認証結果 |
| `Chat(...)` | チャット結果 |
| `Touches { player, frames }` | プレイヤーのタッチ |
| `Judges { player, judges }` | プレイヤーの判定 |
| `Message(...)` | ルームメッセージ |
| `ChangeState(...)` | ルーム状態変更 |
| `ChangeHost(...)` | ホスト変更 |
| `RoomResponse(...)` | ルーム一覧（QueryRoomInfo の応答） |
| `RoomEvent(...)` | ルームイベント（room monitor 用） |
| `UserVisit(...)` | ユーザー訪問通知（room monitor 用） |

### ルームモニタープロトコル

room monitor は `RoomMonitorAuthenticate { key }` で接続し、接続後は以下を受信できます：
- `RoomEvent`：ルーム作成/更新/参加/退出/新ラウンド
- `UserVisit`：ユーザー訪問通知
- `QueryRoomInfo` によるルーム一覧の取得

---

## 設定ファイル (`server_config.yml`)

```yaml
# ネットワーク
port: 12346                    # TCP リッスンポート
http_port: 12347               # HTTP/SSE ポート

# 認証
monitors: [2]                  # 観戦を許可する Phira ユーザー ID
phira_api_endpoint: "https://phira.5wyxi.com"

# プラグイン
plugins_dir: plugins

# 機能
chat_enabled: true
cli_enabled: true

# 制限
connection_rate_limit: 30      # 接続レート制限
connection_rate_window: 10     # 統計ウィンドウ（秒）
round_data_retention_days: 7   # ラウンドデータ保持日数

# データベース
# database_url: "postgres://user:pass@localhost:5432/phira_mp_plus"
```

---

## 内部ルート (`server_state_query`)

これらは `PlusServerState` を介して内部で呼び出されるサーバー側クエリメソッドで、Web API と CLI で使用されます。

| メソッド | 説明 |
|------|------|
| `player.touches` | プレイヤーのタッチデータを照会 |
| `player.judges` | プレイヤーの判定データを照会 |
| `round.data` | ラウンドデータ |
| `round.list` | ラウンド一覧 |
| `room.uuid` | ルーム UUID |
| `room.history` | ルーム履歴 |
| `room.round_info` | ラウンド詳細 |
| `room.list_since` | 指定時間以降のルーム |
| `room.kick` | プレイヤーをキック |
| `room.transfer_host` | ホストを移譲 |
| `room.set_lock` | ロックを設定 |
| `room.close` | ルームを閉じる |
| `admin.kick_user` | 管理者によるキック |
| `admin.ban_user` | BAN |
| `admin.unban_user` | BAN 解除 |
| `admin.is_banned` | BAN 状態を照会 |
| `admin.ban_list` | BAN 一覧 |
| `admin.list_users` | ユーザー一覧 |
| `user.room_history` | ユーザーのルーム履歴 |
| `rooms.list` | ルーム一覧 |
| `rooms.by_name` | 名前でルームを検索 |
| `rooms.by_user` | ユーザーでルームを検索 |
| `user_name` | ユーザー名照会 |
| `test.run_benchmark` | 負荷テスト |
| `test.cleanup` | テストデータのクリーンアップ |
