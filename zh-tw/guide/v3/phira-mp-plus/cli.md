# Phira-mp+ CLI 命令文件

## 啟動參數

```
phira-mp-plus-server [OPTIONS]

  -p, --port <PORT>          伺服器監聽埠 [預設: 12346]
  -d, --plugins-dir <DIR>    WASM 插件目錄路徑 [預設: "plugins"]
  -e, --ext-file <FILE>      擴充資料持久化 JSON 檔案路徑 [預設: "data/extensions.json"]
      --no-cli               停用互動式 CLI 管理控制臺
  -l, --log-file <NAME>      日誌檔案基礎名稱 [預設: "phira-mp-plus"]
  -m, --monitor <IDS>...     允許旁觀的使用者 ID（可多次指定，如 `-m 1 -m 2`）
      --http-port <PORT>     HTTP/SSE 服務埠 [預設: 12347]
  -c, --config <FILE>        YAML 設定檔路徑 [預設: "server_config.yml"]
  -h, --help                 顯示幫助資訊
  -V, --version              顯示版本號
```

配置載入順序（後覆蓋前）：YAML 設定檔 < 環境變數 < CLI 參數。

## 互動式管理控制臺

伺服器在一般互動式終端和 tmux 中啟動 ratatui 管理控制臺。GNU Screen 環境自動切換為逐行相容控制臺，不輸出顏色、備用畫面、滑鼠或 Bracketed Paste 控制序列；重新導向、systemd 和其他非 TTY 環境也使用逐行控制臺。設定 `NO_COLOR` 可在其他終端中關閉顏色。

### 命令列表

#### 通用命令

| 命令 | 別名 | 說明 |
|------|------|------|
| `help` | `h`, `?` | 顯示幫助資訊 |
| `exit` | `quit`, `q` | 關閉伺服器 |
| `status` | `st` | 顯示伺服器狀態 |

#### 插件管理（WASM）

| 命令 | 說明 |
|------|------|
| `plugin list` | 列出所有已載入的 WASM 插件 |
| `plugin enable <名>` | 啟用指定插件 |
| `plugin disable <名>` | 停用指定插件 |
| `plugin info <名>` | 顯示插件詳細資訊 |
| `plugin reload` | 重載所有 WASM 插件 |

#### 使用者管理

| 命令 | 說明 |
|------|------|
| `users` | 列出線上使用者 |
| `kick <使用者ID>` | 從伺服器踢出使用者 |
| `kick <房間ID> <使用者ID>` | 從房間踢出使用者 |
| `broadcast [作用域] <訊息>` | 廣播訊息 |

##### broadcast 作用域

```
broadcast all <訊息>             廣播給所有使用者
broadcast room <房間ID> <訊息>    廣播給指定房間
broadcast user <使用者ID> <訊息>    發送給指定使用者
```

#### 房間管理（room 子命令）

| 命令 | 說明 |
|------|------|
| `rooms` / `room list` | 列出活躍房間 |
| `room info <房間ID>` | 房間詳情（狀態、房主、譜面、歷史） |
| `room start <房間ID>` | 強制開始遊戲 |
| `room cancel <房間ID>` | 取消準備狀態 |
| `room kick <房間ID> <使用者ID>` | 從房間踢出使用者 |
| `room transfer <房間ID> <使用者ID>` | 轉移房主 |
| `room set <房間ID> <欄位> <值>` | 修改房間設定（lock/cycle/chart-id） |
| `room close <房間ID>` | 解散房間 |
| `room history <房間ID>` | 檢視遊玩記錄 |
| `room ban <房間ID> <使用者ID>` | 房間加入黑名單 |
| `room unban <房間ID> <使用者ID>` | 房間移出黑名單 |
| `room banlist <房間ID>` | 房間黑名單列表 |

相容舊別名：`rooms`, `room-info` / `ri`, `room-start` / `rs`, `room-cancel` / `rc`,
`room-transfer` / `rt`, `room-history` / `rh`, `close-room` / `cr`,
`room-ban` / `rb`, `room-unban` / `ru`, `room-banlist` / `rbl`

#### 黑名單管理

| 命令 | 說明 |
|------|------|
| `ban <使用者ID> [原因]` | 封禁使用者 |
| `unban <使用者ID>` | 解封使用者 |
| `banlist` | 列出封禁列表 |

#### 擴充資料

| 命令 | 說明 |
|------|------|
| `ext-list` | 列出所有註冊的擴充資料欄位 |
| `ext-get <ID> <key>` | 獲取指定使用者/房間的擴充資料 |

## Web API

中央 HTTP/SSE 伺服器監聽設定的 `--http-port`（預設 12347）。

| 端點 | 說明 |
|------|------|
| `GET /api/rooms` | 房間列表（含詳情） |
| `GET /api/rooms/{name}` | 指定房間資訊 |
| `GET /api/user_name/{id}` | 使用者名稱查詢 |
| `GET /api/players/count` | 線上玩家數 |
| `GET /api/events` | 統一 SSE 端點 |
| `GET /rooms/listen` | SSE 房間事件流（web-monitor 相容） |
| `GET /ws/live` | WebSocket 即時監測（web-monitor 相容） |

詳細 API 文件見 [api.md](api.md)。

## WASM 插件系統

伺服器支援透過 wasmtime 載入 `.wasm` 插件。插件需放置在 `plugins/` 目錄（可透過 `-d` 自訂）。
插件透過 `phira:host/api` 匯入函式存取伺服器全部能力：

- 狀態查詢：rooms.list, player.touches, round.data 等
- 訊息發送：send.to_user, send.to_room, send.to_all
- 房間管理：room.kick, room.transfer_host, room.set_lock, room.close
- 使用者管理：admin.kick_user, admin.ban_user, admin.unban_user, admin.is_banned
- 插件互呼叫：plugin.api_call, plugin.api_register
- 資料讀寫：ext.get/set, config.get/set, file.read/write
- HTTP 請求：http.get/post

具體介面定義見 `wit/phira/mpplus.wit`。

## 日誌檔案

日誌檔案儲存在 `log/` 目錄下，按小時輪轉。

日誌級別透過 `RUST_LOG` 環境變數控制：

```bash
RUST_LOG=info phira-mp-plus-server
RUST_LOG=debug phira-mp-plus-server
```
