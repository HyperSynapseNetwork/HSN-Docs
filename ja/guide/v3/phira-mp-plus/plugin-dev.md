# Phira-mp+ プラグイン開発ドキュメント

Phira-mp+ は **WASM プラグイン**をサポートしています。WebAssembly にコンパイル後、wasmtime を介して動的にロードされます。

> 内蔵プラグインシステム（NativePlugin trait）はサーバーコアコードに統合され、独立したネイティブプラグインの登録はサポートされなくなりました。
> 外部拡張には WASM プラグインを使用してください。

## WASM プラグイン

WASM プラグインは wasmtime ランタイムを介して動的にロードされ、`plugins/` ディレクトリに配置されます（`-d` パラメータでカスタマイズ可能）。

### JSON ABI

WASM プラグインは JSON 文字列を介してホストと通信します：

**エクスポート関数：**

| 関数 | シグネチャ | 説明 |
|------|------|------|
| `phira_init` | `() -> i32` | プラグインを初期化、0 を返せば成功 |
| `phira_get_info` | `() -> ()` | プラグインメタデータをメモリオフセット 0 に書き込む |
| `phira_cleanup` | `() -> ()` | プラグインアンロード時のクリーンアップ |
| `phira_on_event` | `(ptr: i32, len: i32) -> i32` | イベント処理、0=処理済み 1=未処理 |
| `phira_alloc` | `(size: i32) -> i32` | リニアメモリを割り当て、ポインタを返す |
| `phira_dealloc` | `(ptr: i32, size: i32)` | メモリを解放 |

**インポート関数（ホスト提供）：**

| 関数 | 説明 |
|------|------|
| `phira:host/log(level_ptr, level_len, msg_ptr, msg_len)` | ログを記録 |
| `phira:host/uuid(out_ptr, out_len)` | UUID v4 を生成 |
| `phira:host/time() -> i64` | Unix タイムスタンプを取得（ミリ秒） |
| `phira:host/api(method_ptr, method_len, args_ptr, args_len, out_ptr, out_len) -> i32` | 汎用 API ブリッジ |

### 汎用 API (`phira:host/api`)

すべてのメソッドは JSON パラメータで呼び出し、JSON 結果を返します。戻りコード：0=成功、0以外=エラー。

| メソッド | パラメータ | 戻り値 | 説明 |
|------|------|------|------|
| `state.query` | `{ method, params }` | クエリ結果 | 統合状態クエリエントリー |
| `player.touches` | `{ user_id }` | 最近のタッチデータ | ユーザーの最近のタッチフレームを照会 |
| `player.judges` | `{ user_id }` | 最近の判定データ | ユーザーの最近の判定イベントを照会 |
| `round.data` | `{ round_uuid, player_id }` | 完全な Touches/Judges | ラウンドデータ照会 |
| `round.list` | `{}` | ラウンド一覧 | 記録済みの全ラウンド |
| `send.to_user` | `{ user_id, message }` | `"ok"` | 指定ユーザーにメッセージを送信 |
| `send.to_room` | `{ room_id, message }` | `"ok"` | ルームにメッセージをブロードキャスト |
| `send.to_all` | `{ message }` | `"ok"` | 全ユーザーにブロードキャスト |
| `ext.get_user` | `{ user_id, key }` | フィールド値 | ユーザー拡張データを取得 |
| `ext.set_user` | `{ user_id, key, value }` | `"ok"` | ユーザー拡張データを設定 |
| `ext.get_room` | `{ room_id, key }` | フィールド値 | ルーム拡張データを取得 |
| `ext.set_room` | `{ room_id, key, value }` | `"ok"` | ルーム拡張データを設定 |
| `room.kick` | `{ room_id, target_id }` | `{"ok": true}` | ルームからユーザーをキック |
| `room.transfer_host` | `{ room_id, target_id }` | `{"ok": true}` | ホストを移譲 |
| `room.set_lock` | `{ room_id, locked }` | `{"ok": true}` | ルームをロック/アンロック |
| `room.close` | `{ room_id }` | `{"ok": true}` | ルームを解散 |
| `admin.kick_user` | `{ user_id, reason }` | `{"ok": true}` | サーバーからユーザーをキック |
| `admin.ban_user` | `{ user_id, reason }` | `{"ok": true}` | ユーザーを BAN |
| `admin.unban_user` | `{ user_id }` | `{"ok": true}` | ユーザーの BAN を解除 |
| `admin.is_banned` | `{ user_id }` | `{"banned": bool}` | BAN 状態を確認 |
| `admin.ban_list` | `{}` | BAN 一覧 | すべての BAN を取得 |
| `admin.list_users` | `{}` | ユーザー一覧 | 全オンラインユーザーを一覧表示 |
| `plugin.api_call` | `{ plugin, method, args }` | 呼び出し結果 | 他のプラグインが登録した API を呼び出す |
| `plugin.api_register` | `{ method }` | 登録確認 | 本プラグインの API を他のプラグインが呼び出せるよう登録 |
| `config.get` | `{ key }` | 設定値 | プラグイン設定を取得 |
| `config.set` | `{ key, value }` | `"ok"` | プラグイン設定を設定 |
| `http.get` | `{ url }` | レスポンス本文 | HTTP GET リクエスト |
| `http.post` | `{ url, body, content_type }` | レスポンス本文 | HTTP POST リクエスト |
| `file.read` | `{ path }` | ファイル内容 | プラグインデータファイルを読み込む |
| `file.write` | `{ path, content }` | `"ok"` | プラグインデータファイルを書き込む |
| `uuid.v4` | `{}` | UUID 文字列 | UUID を生成 |
| `time.now` | `{}` | Unix タイムスタンプ | 現在時刻を取得 |

完全な WIT 定義は `wit/phira/mpplus.wit` を参照してください。

### プラグインイベント

WASM プラグインは `phira_on_event` を介してイベントを受信します。イベントは JSON 形式で渡され、type フィールドがイベントタイプを識別します：

| type | データフィールド | トリガー条件 |
|------|---------|---------|
| `user_connect` | user_id, user_name, user_ip | ユーザー認証通過後 |
| `user_disconnect` | user_id, user_name | ユーザー切断 |
| `room_create` | user_id, room_id | ルーム作成 |
| `room_join` | user_id, room_id, is_monitor | ルーム参加 |
| `room_leave` | user_id, room_id | ルーム退出 |
| `room_modify` | user_id, room_id, data | ルーム設定変更 |
| `game_start` | user_id, room_id | ゲーム開始 |
| `game_end` | user_id, user_name, room_id, score, accuracy, perfect, good, bad, miss, max_combo, full_combo | プレイヤーがスコアを提出 |
| `player_touches` | user_id, room_id, data | プレイヤータッチイベント |
| `player_judges` | user_id, room_id, data | プレイヤー判定イベント |
| `round_complete` | room_id, chart_id, chart_name | 1ラウンド完了 |

例 — ユーザー接続イベントの監視：

```javascript
// phira_on_event 内：
function phira_on_event(event_ptr, event_len) {
  let json = memory_to_string(event_ptr, event_len);
  let event = JSON.parse(json);
  if (event.type === 'user_connect') {
    console.log(`User ${event.user_name}(${event.user_id}) connected from ${event.user_ip}`);
  }
  return 0; // 0 = handled
}
```

### プラグインメタデータ

WASM プラグインは以下の 2 つの方法でメタデータを宣言できます：

1. **`phira_get_info` のエクスポート** — プラグインが自身で JSON メタデータをリニアメモリに書き込む
2. **メモリオフセット 0** — WASM モジュールのオフセット 0 に長さプレフィックス付き JSON を配置（互換モード）

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "author": "me",
  "description": "My WASM plugin"
}
```

## プラグイン間 API 呼び出し

WASM プラグインは `plugin.api_call` で他のプラグインが登録した API を呼び出せます：

```javascript
// playtime-tracker プラグインの count メソッドを呼び出す
let result = api.call('plugin.api_call', {
  plugin: 'player-tracker',
  method: 'count',
  args: []
});
// result = {"count": 42}
```

`plugin.api_register` で自身の API を登録：

```javascript
api.call('plugin.api_register', {
  method: 'my_custom_api'
});
```

> 注意：完全な双方向 WASM コールバックは現在スタブです。登録後に呼び出しは可能ですが、固定レスポンスを返します。
> ネイティブ Rust で登録された API（PluginManager::register_plugin_api 経由）は WASM プラグインから正常に呼び出せます。

## リアルタイムデータストリーム

Touches/Judges データは `player_touches` および `player_judges` イベントとして WASM プラグインの `phira_on_event` ハンドラーにプッシュされます。アクティブなポーリングは必要ありません。

## WASM プラグインのビルド

WASM プラグインはターゲット `wasm32-unknown-unknown` でコンパイルする必要があります：

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

生成された `.wasm` ファイルをサーバーの `plugins/` ディレクトリに配置します。次回起動時または `plugin reload` 実行時にロードされます。

## サーバー設定

WASM プラグインは `config.get` / `config.set` API で自身の設定（メモリ上、再起動で消失）を読み書きできます。
永続化設定には `file.read` / `file.write` を使用して `data/plugins/<plugin_name>/` ディレクトリで操作することを推奨します。

## WIT インターフェース定義

完全な WIT インターフェース定義は `wit/phira/mpplus.wit` にあり、以下のインターフェースを含みます：

- `user-events` — ユーザーイベント監視
- `user-info` — ユーザー情報照会
- `room-info` — ルーム情報照会
- `messaging` — メッセージ送信
- `room-management` — ルーム管理
- `user-management` — ユーザー管理
- `utilities` — ユーティリティ関数
- `database` — データベースインターフェース（予約）
- `plugin-config` — プラグイン設定
- `plugin` — プラグインメインエントリー
- `cli` — CLI コマンドインターフェース
