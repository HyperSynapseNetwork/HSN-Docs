# Phira-mp+ API 文件

## HTTP API（埠 12347）

所有 HTTP API 透過 `plugin_http` 提供，支援 JSON 請求/回應。

### 房間資訊

#### `GET /api/rooms`
回傳所有活躍房間列表及伺服器統計。

**回應：** `200 OK` JSON
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

| 欄位 | 說明 |
|------|------|
| `rooms` | 活躍房間列表 |
| `player_count` | 目前線上玩家數 |
| `total_players` | 連線過伺服器的總玩家數 |

#### `GET /api/rooms/<name>`
回傳指定房間詳情。

**參數：** `<name>` — 房間名（URL 路徑）

**回應：** `200 OK` JSON
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
根據 Phira ID 獲取使用者名稱。

**參數：** `<id>` — Phira 使用者 ID

**回應：** `200 OK`
```
使用者名稱
```

#### `GET /api/players/count`
獲取目前線上玩家數。

**回應：** `200 OK`
```json
{"count": 5}
```

#### `GET /api/players/all`
獲取所有連線過伺服器的玩家 ID 列表。

**回應：** `200 OK`
```json
{
  "total": 42,
  "players": [16, 17, 18, 19]
}
```

### SSE 事件

#### `GET /api/events`

統一事件流。連線建立後立即發送 `ready`，房間生命週期事件也會進入該流。

#### `GET /rooms/listen`

房間事件流。連線建立時的發送順序如下：

1. `ready`：表示流已建立；
2. 每個現有房間對應一條 `update_room` 快照；
3. 持續發送後續房間事件。

事件資料與 `phira-web-monitor` 的房間事件結構一致：

- `create_room`：`{ "room": string, "data": RoomData }`
- `update_room`：`{ "room": string, "data": PartialRoomData | RoomData }`
- `join_room`：`{ "room": string, "user": number }`
- `leave_room`：`{ "room": string, "user": number }`
- `new_round`：`{ "room": string, "round": RoundData }`
- `stream_lagged`：消費者落後於廣播緩衝區，`skipped` 表示丟棄的事件數

驗證命令：

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

即使當前沒有房間，也應立即看到 `event: ready`，而不是只有 keep-alive 註解。回應包含 `Cache-Control: no-cache` 與 `X-Accel-Buffering: no`，用於避免常見反向代理緩衝事件流。

### WebSocket

#### `GET /ws/live`
即時遊戲資料 WebSocket（web-monitor 相容）。

---

## CLI 命令

在 TUI 或 stdin CLI 中輸入以下命令：

### 系統命令

| 命令 | 說明 |
|------|------|
| `help` | 顯示所有可用命令 |
| `exit` / `quit` | 關閉伺服器 |
| `benchmark [dur_s=30] [rooms=100]` | 壓力測試 |

### 房間管理

| 命令 | 說明 |
|------|------|
| `rooms` / `r` | 列出所有房間 |
| `room info <id>` / `room i <id>` | 檢視房間詳情 |
| `room kick <id> <user_id>` | 踢出使用者 |
| `room close <id>` | 關閉房間 |
| `room transfer <id> <user_id>` | 轉移房主 |
| `room set <id> <欄位> <值>` | 修改房間設定（lock/cycle 等） |
| `room history <id>` | 房間遊玩歷史（替代廢棄的 round-last） |
| `room uuid <id>` | 房間 UUID |
| `room ban <id> <user_id>` | 拉黑使用者 |
| `room unban <id> <user_id>` | 取消拉黑 |
| `room banlist <id>` | 房間黑名單 |

### 玩家管理

| 命令 | 說明 |
|------|------|
| `users` / `u` | 列出所有線上玩家 |
| `user-rooms <user_id>` / `rh <user_id>` | 玩家的房間訪問歷史 |
| `ban <user_id> [reason]` | 封禁使用者 |
| `unban <user_id>` | 解封使用者 |
| `kick <user_id>` | 踢出使用者 |
| `pardon <user_id>` | 解封 |

### 遊玩統計

| 命令 | 說明 |
|------|------|
| `playtime <user_id>` | 查詢使用者遊玩時間 |
| `player-count` | 遊玩過的玩家總數 |
| `room history <room_id>` | 檢視房間遊玩記錄（替代廢棄的 round-last） |

### 歡迎語

| 命令 | 說明 |
|------|------|
| `welcome-config` | 檢視歡迎語配置與佔位符 |

### 佔位符（歡迎語模板）

| 佔位符 | 說明 |
|--------|------|
| `[user_name]` | 使用者名稱 |
| `[user_id]` | Phira ID |
| `[player-count]` | 當前線上數 |
| `[players]` | 同上 |
| `[time]` | Unix 時間戳 |
| `[playtime]` | 該使用者遊玩時間 |
| `[playtime <id>]` | 指定使用者遊玩時間 |
| `[top_playtime]` | 遊玩時間排行榜（前10） |
| `[active_rooms]` | 活躍房間詳情 |

---

## TCP 二進位協定（埠 12346）

與 Phira 遊戲客戶端通訊的二進位協定。使用自訂二進位格式（`BinaryData` derive），詳見 `phira-mp-common`。

### 連線流程

1. 客戶端發送版本位元組（1）
2. 客戶端發送 `Authenticate { token: Varchar<32> }`
3. 伺服端回覆 `Authenticate(Ok((UserInfo, Option<ClientRoomState>)))`
4. 心跳：客戶端每 3 秒發送 `Ping`，伺服端回覆 `Pong`

### 客戶端命令

| 命令 | 說明 |
|------|------|
| `Ping` | 心跳 |
| `Authenticate { token }` | 認證 |
| `Chat { message }` | 發送聊天訊息 |
| `Touches { frames }` | 觸控資料 |
| `Judges { judges }` | 判定資料 |
| `CreateRoom { id }` | 建立房間 |
| `JoinRoom { id, monitor }` | 加入房間 |
| `LeaveRoom` | 離開房間 |
| `LockRoom { lock }` | 鎖定/解鎖房間 |
| `CycleRoom { cycle }` | 循環模式 |
| `SelectChart { id }` | 選譜 |
| `RequestStart` | 請求開始 |
| `Ready` | 準備 |
| `CancelReady` | 取消準備 |
| `Played { id }` | 遊玩完成 |
| `Abort` | 中止 |
| `QueryRoomInfo` | 查詢房間列表 |

### 伺服端命令

| 命令 | 說明 |
|------|------|
| `Pong` | 心跳回覆 |
| `Authenticate(...)` | 認證結果 |
| `Chat(...)` | 聊天結果 |
| `Touches { player, frames }` | 玩家觸控 |
| `Judges { player, judges }` | 玩家判定 |
| `Message(...)` | 房間訊息 |
| `ChangeState(...)` | 房間狀態變更 |
| `ChangeHost(...)` | 房主變更 |
| `RoomResponse(...)` | 房間列表（QueryRoomInfo 回覆） |
| `RoomEvent(...)` | 房間事件（room monitor 用） |
| `UserVisit(...)` | 使用者訪問通知（room monitor 用） |

### 房間 Monitor 協定

room monitor 透過 `RoomMonitorAuthenticate { key }` 連線，連線後可接收：
- `RoomEvent`：房間建立/更新/加入/離開/新輪次
- `UserVisit`：使用者訪問通知
- 透過 `QueryRoomInfo` 獲取房間列表

---

## 設定檔 (`server_config.yml`)

```yaml
# 網路
port: 12346                    # TCP 監聽埠
http_port: 12347               # HTTP/SSE 埠

# 認證
monitors: [2]                  # 允許旁觀的 Phira 使用者 ID
phira_api_endpoint: "https://phira.5wyxi.com"

# 插件
plugins_dir: plugins

# 功能
chat_enabled: true
cli_enabled: true

# 限制
connection_rate_limit: 30      # 連線速率限制
connection_rate_window: 10     # 統計窗口（秒）
round_data_retention_days: 7   # 輪次資料保留天數

# 資料庫
# database_url: "postgres://user:pass@localhost:5432/phira_mp_plus"
```

---

## 內部路由 (`server_state_query`)

這些是透過 `PlusServerState` 內部呼叫的伺服端查詢方法，供 Web API 和 CLI 使用。

| 方法 | 說明 |
|------|------|
| `player.touches` | 查詢玩家觸控資料 |
| `player.judges` | 查詢玩家判定資料 |
| `round.data` | 輪次資料 |
| `round.list` | 輪次列表 |
| `room.uuid` | 房間 UUID |
| `room.history` | 房間歷史 |
| `room.round_info` | 輪次詳情 |
| `room.list_since` | 指定時間後的房間 |
| `room.kick` | 踢出玩家 |
| `room.transfer_host` | 轉移房主 |
| `room.set_lock` | 設定鎖定 |
| `room.close` | 關閉房間 |
| `admin.kick_user` | 管理員踢人 |
| `admin.ban_user` | 封禁 |
| `admin.unban_user` | 解封 |
| `admin.is_banned` | 查詢封禁狀態 |
| `admin.ban_list` | 封禁列表 |
| `admin.list_users` | 使用者列表 |
| `user.room_history` | 使用者房間歷史 |
| `rooms.list` | 房間列表 |
| `rooms.by_name` | 按名稱查詢房間 |
| `rooms.by_user` | 按使用者查詢房間 |
| `user_name` | 使用者名稱查詢 |
| `test.run_benchmark` | 壓測 |
| `test.cleanup` | 清理測試資料 |
