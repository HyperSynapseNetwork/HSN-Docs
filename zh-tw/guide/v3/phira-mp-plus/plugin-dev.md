# Phira-mp+ 插件開發文件

Phira-mp+ 支援 **WASM 插件** — 編譯為 WebAssembly 後透過 wasmtime 動態載入。

> 內建插件系統（NativePlugin trait）已合併入伺服器核心程式碼，不再支援獨立原生插件註冊。
> 外部擴充請使用 WASM 插件。

## WASM 插件

WASM 插件透過 wasmtime 執行時期動態載入，部署在 `plugins/` 目錄下（可透過 `-d` 參數自訂）。

### JSON ABI

WASM 插件透過 JSON 字串與宿主通訊：

**匯出函式：**

| 函式 | 簽名 | 說明 |
|------|------|------|
| `phira_init` | `() -> i32` | 初始化插件，回傳 0 表示成功 |
| `phira_get_info` | `() -> ()` | 填寫插件元資料到記憶體偏移 0 |
| `phira_cleanup` | `() -> ()` | 插件卸載時清理 |
| `phira_on_event` | `(ptr: i32, len: i32) -> i32` | 事件處理，回傳 0=已處理 1=未處理 |
| `phira_alloc` | `(size: i32) -> i32` | 分配線性記憶體，回傳指標 |
| `phira_dealloc` | `(ptr: i32, size: i32)` | 釋放記憶體 |

**匯入函式（宿主提供）：**

| 函式 | 說明 |
|------|------|
| `phira:host/log(level_ptr, level_len, msg_ptr, msg_len)` | 記錄日誌 |
| `phira:host/uuid(out_ptr, out_len)` | 生成 UUID v4 |
| `phira:host/time() -> i64` | 獲取 Unix 時間戳（毫秒） |
| `phira:host/api(method_ptr, method_len, args_ptr, args_len, out_ptr, out_len) -> i32` | 通用 API 橋接 |

### 通用 API (`phira:host/api`)

所有方法透過 JSON 參數呼叫，回傳 JSON 結果。回傳碼：0=成功，非0=錯誤。

| 方法 | 參數 | 回傳 | 說明 |
|------|------|------|------|
| `state.query` | `{ method, params }` | 查詢結果 | 統一狀態查詢入口 |
| `player.touches` | `{ user_id }` | 最近觸控資料 | 查詢使用者最近觸控幀 |
| `player.judges` | `{ user_id }` | 最近判定資料 | 查詢使用者最近判定事件 |
| `round.data` | `{ round_uuid, player_id }` | 完整 Touches/Judges | 輪次資料查詢 |
| `round.list` | `{}` | 輪次列表 | 所有已記錄輪次 |
| `send.to_user` | `{ user_id, message }` | `"ok"` | 發送訊息給指定使用者 |
| `send.to_room` | `{ room_id, message }` | `"ok"` | 向房間廣播訊息 |
| `send.to_all` | `{ message }` | `"ok"` | 向所有使用者廣播 |
| `ext.get_user` | `{ user_id, key }` | 欄位值 | 獲取使用者擴充資料 |
| `ext.set_user` | `{ user_id, key, value }` | `"ok"` | 設定使用者擴充資料 |
| `ext.get_room` | `{ room_id, key }` | 欄位值 | 獲取房間擴充資料 |
| `ext.set_room` | `{ room_id, key, value }` | `"ok"` | 設定房間擴充資料 |
| `room.kick` | `{ room_id, target_id }` | `{"ok": true}` | 從房間踢出使用者 |
| `room.transfer_host` | `{ room_id, target_id }` | `{"ok": true}` | 轉移房主 |
| `room.set_lock` | `{ room_id, locked }` | `{"ok": true}` | 鎖定/解鎖房間 |
| `room.close` | `{ room_id }` | `{"ok": true}` | 解散房間 |
| `admin.kick_user` | `{ user_id, reason }` | `{"ok": true}` | 從伺服器踢出使用者 |
| `admin.ban_user` | `{ user_id, reason }` | `{"ok": true}` | 封禁使用者 |
| `admin.unban_user` | `{ user_id }` | `{"ok": true}` | 解封使用者 |
| `admin.is_banned` | `{ user_id }` | `{"banned": bool}` | 檢查封禁狀態 |
| `admin.ban_list` | `{}` | 封禁列表 | 獲取所有封禁 |
| `admin.list_users` | `{}` | 使用者列表 | 列出所有線上使用者 |
| `plugin.api_call` | `{ plugin, method, args }` | 呼叫結果 | 呼叫其他插件註冊的 API |
| `plugin.api_register` | `{ method }` | 註冊確認 | 註冊本插件 API 供其他插件呼叫 |
| `config.get` | `{ key }` | 配置值 | 獲取插件配置 |
| `config.set` | `{ key, value }` | `"ok"` | 設定插件配置 |
| `http.get` | `{ url }` | 回應正文 | HTTP GET 請求 |
| `http.post` | `{ url, body, content_type }` | 回應正文 | HTTP POST 請求 |
| `file.read` | `{ path }` | 檔案內容 | 讀取插件資料檔案 |
| `file.write` | `{ path, content }` | `"ok"` | 寫入插件資料檔案 |
| `uuid.v4` | `{}` | UUID 字串 | 生成 UUID |
| `time.now` | `{}` | Unix 時間戳 | 獲取當前時間 |

完整 WIT 定義見 `wit/phira/mpplus.wit`。

### 插件事件

WASM 插件透過 `phira_on_event` 接收事件，事件以 JSON 格式傳入。type 欄位標識事件類型：

| type | 資料欄位 | 觸發時機 |
|------|---------|---------|
| `user_connect` | user_id, user_name, user_ip | 使用者認證通過後 |
| `user_disconnect` | user_id, user_name | 使用者斷開連線 |
| `room_create` | user_id, room_id | 建立房間 |
| `room_join` | user_id, room_id, is_monitor | 加入房間 |
| `room_leave` | user_id, room_id | 離開房間 |
| `room_modify` | user_id, room_id, data | 修改房間設定 |
| `game_start` | user_id, room_id | 遊戲開始 |
| `game_end` | user_id, user_name, room_id, score, accuracy, perfect, good, bad, miss, max_combo, full_combo | 玩家提交成績 |
| `player_touches` | user_id, room_id, data | 玩家觸控事件 |
| `player_judges` | user_id, room_id, data | 玩家判定事件 |
| `round_complete` | room_id, chart_id, chart_name | 一輪遊戲完成 |

範例 — 監聽使用者連線事件：

```javascript
// 在 phira_on_event 中：
function phira_on_event(event_ptr, event_len) {
  let json = memory_to_string(event_ptr, event_len);
  let event = JSON.parse(json);
  if (event.type === 'user_connect') {
    console.log(`User ${event.user_name}(${event.user_id}) connected from ${event.user_ip}`);
  }
  return 0; // 0 = handled
}
```

### 插件元資料

WASM 插件可透過兩種方式宣告元資料：

1. **匯出 `phira_get_info`** — 插件自行將 JSON 元資料寫入線性記憶體
2. **記憶體偏移 0** — 在 WASM 模組的偏移 0 處放置長度前綴的 JSON（相容模式）

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "author": "me",
  "description": "My WASM plugin"
}
```

## 插件間 API 呼叫

WASM 插件可以透過 `plugin.api_call` 呼叫其他插件註冊的 API：

```javascript
// 呼叫 playtime-tracker 插件的 count 方法
let result = api.call('plugin.api_call', {
  plugin: 'player-tracker',
  method: 'count',
  args: []
});
// result = {"count": 42}
```

透過 `plugin.api_register` 註冊自己的 API：

```javascript
api.call('plugin.api_register', {
  method: 'my_custom_api'
});
```

> 注意：完整雙向 WASM 回呼目前為 stub，註冊後可被呼叫但回傳固定回應。
> 原生 Rust 註冊的 API（透過 PluginManager::register_plugin_api）可被 WASM 插件正常呼叫。

## 即時資料流

Touches/Judges 資料透過 `player_touches` 和 `player_judges` 事件推送到 WASM 插件的 `phira_on_event` 處理器，無需主動輪詢。

## 構建 WASM 插件

WASM 插件需編譯為目標 `wasm32-unknown-unknown`：

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

生成的 `.wasm` 檔案放在伺服器的 `plugins/` 目錄下，下次啟動或執行 `plugin reload` 時載入。

## 伺服器配置

WASM 插件可透過 `config.get` / `config.set` API 讀寫自己的配置（記憶體中，重啟消失）。
持久化配置建議使用 `file.read` / `file.write` 操作 `data/plugins/<plugin_name>/` 目錄。

## WIT 介面定義

完整的 WIT 介面定義見 `wit/phira/mpplus.wit`，包含以下介面：

- `user-events` — 使用者事件監聽
- `user-info` — 使用者資訊查詢
- `room-info` — 房間資訊查詢
- `messaging` — 訊息發送
- `room-management` — 房間管理
- `user-management` — 使用者管理
- `utilities` — 工具函式
- `database` — 資料庫介面（預留）
- `plugin-config` — 插件配置
- `plugin` — 插件主要入口
- `cli` — CLI 命令介面
