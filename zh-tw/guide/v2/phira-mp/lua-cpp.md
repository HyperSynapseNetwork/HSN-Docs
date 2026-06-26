Lua/Cpp Phira-mp 已停止維護，請移步至 [Phira-mp-plus](https://github.com/HyperSynapseNetwork/Phira-mp-plus/)

# Lua/Cpp Phira-mp

一個功能完整、豐富的多人在線遊戲伺服器實作，採用 C++20，完全相容 phira-mp 協定，並擴充了強大的 Lua 插件系統和 RESTful HTTP API。

## 功能特性

### 核心伺服器
- **二進位協定支援** - 完整實作 phira-mp 二進位命令協定，包含 16 種命令類型
- **多執行緒架構** - 高效能會話處理，配備專用連線執行緒
- **房間管理** - 完整的房間系統，支援建立、加入和管理功能
- **使用者會話管理** - 健全的使用者連線處理，採用 UUID 識別

### 插件系統
- **Lua 5.4 整合** - 支援 Lua 指令碼的動態插件載入
- **事件鉤子** - 全面的鉤子系統（`on_enable`、`on_disable`、`on_user_join`、`on_before_command` 等）
- **插件 API** - 透過全域 `phira` 表公開完整的 Lua API，用於伺服器操作
- **熱重載** - 插件可在執行時啟用/停用

### HTTP 介面
- **RESTful 端點** - 埠 61234 上的完整 HTTP API（可設定）
- **公開端點** - 供客戶端應用程式使用的 `/room`、`/stats`
- **回放系統** - 用於回放認證和擷取的 `/replay/*` 端點
- **管理介面** - 透過 HTTP（`/admin/*`）進行完整的管理控制
- **CORS 支援** - 為網頁客戶端啟用跨域請求

### 回放系統
- **錄製與儲存** - 遊戲過程中自動錄製回放
- **基於檔案的儲存** - 回放以二進位檔案形式儲存在 `replays/` 目錄中
- **元資料管理** - 追蹤回放資訊（玩家、歌曲、時間戳、大小）
- **HTTP 存取** - 可透過經過認證的 HTTP 端點存取回放

### 管理員功能
- **基於 Token 的認證** - 簡易的管理員 token 系統（等待 HSN 整合）
- **伺服器配置** - 可透過 HTTP API 動態設定
- **房間控制** - 房間建立、封禁和管理
- **使用者管理** - 使用者封禁、斷開連線和監控
- **廣播系統** - 全伺服器訊息廣播

### 互動式命令列介面
- **即時命令輸入** - 用於伺服器管理的互動式控制臺
- **伺服器狀態監控** - 檢視連線使用者、活躍房間和伺服器統計
- **房間管理** - 直接列出、解散和設定房間
- **使用者管理** - 踢出、封禁、解封和檢視使用者詳情
- **插件控制** - 無需重啟伺服器即可熱重載插件
- **廣播訊息** - 向所有房間或特定房間發送訊息

## 快速開始

### 環境要求
- 支援 C++20 的 **g++ 13+**
- **Lua 5.4** 開發函式庫
- **libuuid** 用於 UUID 生成
- **pthread** 用於執行緒支援

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y g++ make liblua5.4-dev uuid-dev
```

**CentOS/RHEL:**
```bash
sudo yum install -y gcc-c++ make lua-devel libuuid-devel
```

### 編譯
```bash
# 克隆倉庫（如果尚未克隆）
git clone <repository-url>
cd cpp-phira-mp

# 構建伺服器
make clean
make
```

這將生成 `phira-mp-server` 二進位檔案。

### 執行
```bash
# 使用預設埠啟動（遊戲協定 12346，HTTP 61234）
./phira-mp-server

# 使用自訂遊戲埠啟動
./phira-mp-server --port 8080

# 在背景啟動
nohup ./phira-mp-server > server.log 2>&1 &
```

伺服器將會：
1. 從 `server_config.yml` 載入配置（若存在）
2. 掃描並載入 `plugins/` 目錄中的插件
3. 在指定埠（預設：12346）啟動遊戲伺服器
4. 在埠 61234 啟動 HTTP API 伺服器
5. 啟動用於控制臺管理的互動式 CLI
6. 開始接受連線

### 互動式 CLI 使用

啟動伺服器後，您將看到 CLI 提示出現：
```
=== Phira MP Server CLI ===
Type 'help' for available commands
==============================

> 
```

#### 可用命令

**通用命令：**
- `help`, `?` - 顯示幫助訊息
- `status`, `info` - 顯示伺服器狀態
- `stop`, `shutdown` - 顯示關機說明

**房間管理：**
- `list`, `rooms` - 列出所有活躍房間
- `disband <roomId>` - 解散房間
- `maxusers <roomId> <count>` - 設定房間最大人數（1-64）
- `roomcreation <on|off|status>` - 控制房間建立

**使用者管理：**
- `users` - 列出所有線上使用者
- `user <userId>` - 顯示使用者詳情
- `kick <userId>` - 從伺服器踢出使用者
- `ban <userId>` - 封禁使用者
- `unban <userId>` - 解封使用者
- `banlist` - 顯示封禁使用者列表

**通訊：**
- `broadcast <msg>` - 向所有房間廣播訊息
- `say <msg>` - broadcast 的別名
- `roomsay <roomId> <msg>` - 向特定房間發送訊息

**伺服器管理：**
- `reload` - 重載所有插件
- `replay <on|off|status>` - 控制回放錄製

#### 命令範例

```bash
# 檢視伺服器狀態
> status

# 列出所有活躍房間
> list

# 列出所有線上使用者
> users

# 踢出使用者
> kick 12345

# 廣播伺服器訊息
> broadcast Server will restart in 10 minutes

# 向特定房間發送訊息
> roomsay room1 Please follow the game rules

# 解散房間
> disband room1

# 重載所有插件
> reload

# 控制回放錄製
> replay on
> replay status
```

**注意**：對於進階命令（競賽模式、IP 黑名單管理等），請使用埠 61234 上的 HTTP API。

## 配置

### 伺服器配置
在工作目錄中建立 `server_config.yml`：

```yaml
# 遊戲伺服器埠
port: 12346

# HTTP API 伺服器埠
http_port: 61234

# 用於 API 存取的管理員 token（簡化版，等待 HSN 整合）
admin_token: "your-secure-admin-token-here"

# 啟用回放系統
replay_enabled: true

# 啟用房間建立
room_creation_enabled: true

# 監控 ID（遊戲特定）
monitors:
  - 2
  - 42
```

如果未找到設定檔，將使用預設值。

### 插件配置
`plugins/` 目錄中的每個插件需要：
- `plugin.json` - 插件元資料（id、name、version、author、enabled 標記）
- `init.lua` - 主要插件指令碼

範例 `plugin.json`：
```json
{
    "id": "my-plugin",
    "name": "My Plugin",
    "version": "1.0.0",
    "description": "Plugin description",
    "author": "Your Name",
    "enabled": true,
    "dependencies": []
}
```

## 插件系統

### 內建插件
伺服器附帶 5 個內建插件：

1. **http-admin-api** - HTTP 管理 API 端點
2. **replay-recorder** - 遊戲回放錄製與管理
3. **admin-commands** - 管理命令系統
4. **advanced-room-management** - 增強的房間控制與功能
5. **virtual-room** - 虛擬房間建立與管理

### 插件開發
插件使用 Lua 編寫，並可透過全域 `phira` 表存取伺服器。

**完整的插件開發文件，請參閱 [PLUGIN_DEVELOPMENT.md](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/PLUGIN_DEVELOPMENT.md)**

插件系統提供：
- **40+ 伺服器管理 API** - 完全控制使用者、房間、訊息、封禁、競賽和伺服器狀態
- **全面的事件鉤子** - 使用者加入/離開、房間建立/銷毀、踢出、封禁和命令過濾的即時通知
- **HTTP 路由註冊** - 使用自訂端點擴充 HTTP API
- **執行緒安全操作** - 所有 API 均已針對並發存取進行適當同步

#### 新事件鉤子 (v2.0+)
- `on_user_kick(user, room, reason)` - 使用者被踢出時
- `on_user_ban(user, reason, duration)` - 使用者被封禁時
- `on_user_unban(user_id)` - 使用者被解封時
- `on_room_create(room)` - 房間建立時
- `on_room_destroy(room)` - 房間銷毀時

#### 新管理 API (v2.0+)
```lua
-- 使用者管理
phira.kick_user(user_id, preserve_room)
phira.ban_user(user_id)
phira.unban_user(user_id)
phira.is_user_banned(user_id)
phira.get_banned_users()

-- 房間管理
phira.disband_room(room_id)
phira.set_max_users(room_id, max_users)
phira.get_room_max_users(room_id)

-- 訊息發送
phira.broadcast_message(message)
phira.roomsay_message(room_id, message)

-- 伺服器控制
phira.shutdown_server()
phira.reload_plugins()

-- 狀態查詢
phira.get_connected_user_count()
phira.get_active_room_count()
phira.get_room_list()

-- IP 黑名單管理
phira.add_ip_to_blacklist(ip, is_admin)
phira.remove_ip_from_blacklist(ip, is_admin)
phira.is_ip_banned(ip)

-- 競賽管理
phira.enable_contest(room_id, manual_start, auto_disband)
phira.disable_contest(room_id)
phira.start_contest(room_id, force)
```

請參閱 [PLUGIN_DEVELOPMENT.md](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/PLUGIN_DEVELOPMENT.md) 中的完整 API 參考，以取得詳細文件與範例。

## HTTP 介面文件

### 公共端點

#### `GET /room`
獲取所有可用房間的列表。

**回應：**
```json
{
    "rooms": [
        {
            "id": "room-uuid",
            "name": "Room Name",
            "players": 3,
            "maxPlayers": 8,
            "status": "waiting"
        }
    ],
    "total": 1
}
```

#### `GET /stats`
獲取伺服器統計資料。

**回應：**
```json
{
    "users": 5,
    "sessions": 5,
    "rooms": 2,
    "uptime": 3600,
    "version": "1.0.0"
}
```

### 回放端點

#### `POST /replay/auth`
認證以取得回放存取權（stub 實作）。

**請求：**
```json
{
    "token": "user-token"
}
```

**回應：**
```json
{
    "ok": true,
    "userId": 12345,
    "charts": [],
    "sessionToken": "mock_session_token",
    "expiresAt": 1678886400
}
```

#### `GET /replay/download`
下載回放檔案（需要認證）。

**查詢參數：**
- `id` - 回放 ID
- `token` - 會話 token

#### `POST /replay/delete`
刪除回放（stub 實作）。

### 管理員端點
所有管理員端點需要透過 `admin_token` 參數進行認證（查詢字串或請求主體）。

#### 認證方式
1. **查詢參數**：`?admin_token=your-token`
2. **請求主體**：`{"admin_token": "your-token"}`

#### 可用管理端點

**配置管理：**
- `GET /admin/replay/config` - 獲取回放配置
- `POST /admin/replay/config` - 更新回放配置
- `GET /admin/room-creation/config` - 獲取房間建立配置
- `POST /admin/room-creation/config` - 更新房間建立配置

**房間管理：**
- `GET /admin/rooms` - 列出所有房間及詳情
- `POST /admin/ban/room` - 封禁房間
- `POST /admin/rooms/max_users` - 設定房間最大人數
- `POST /admin/rooms/disband` - 解散房間
- `POST /admin/rooms/chat` - 發送房間聊天訊息

**使用者管理：**
- `GET /admin/users/info` - 獲取使用者資訊
- `POST /admin/ban/user` - 封禁使用者
- `POST /admin/users/disconnect` - 斷開使用者連線
- `POST /admin/users/move` - 將使用者移至不同房間

**伺服器控制：**
- `POST /admin/broadcast` - 向所有使用者廣播訊息
- `GET /admin/ip-blacklist` - 獲取 IP 黑名單
- `POST /admin/ip-blacklist/remove` - 從黑名單移除 IP
- `POST /admin/ip-blacklist/clear` - 清除 IP 黑名單
- `GET /admin/log-rate` - 獲取日誌速率配置

**OTP 端點（簡化版 - 等待 HSN 整合）：**
- `POST /admin/otp/request` - 請求 OTP（回傳虛擬 session）
- `POST /admin/otp/verify` - 驗證 OTP（接受 "123456" 用於測試）

## 認證與安全

### 當前實作
當前的認證系統為簡化版本，等待與 HSN（HyperSynapseNetwork）統一使用者系統整合。

**管理員認證：**
- 配置中的單一 `admin_token`
- Token 透過查詢參數或請求主體傳遞
- 當前簡化版本中無 OTP/IP 封禁

**未來 HSN 整合：**
- 跨服務的統一使用者帳戶
- 基於 OTP 的管理員認證
- 基於 IP 的速率限制和封禁
- 會話管理

### 安全說明
1. **生產環境使用**：當前簡化認證僅供開發/測試使用
2. **Token 安全**：確保 `admin_token` 安全並定期輪換
3. **網路安全**：在生產環境中應在防火牆/反向代理後執行
4. **HTTPS**：對於生產環境，請在反向代理處使用 HTTPS 終止

## 回放系統

### 工作原理
1. **錄製**：遊戲過程中，伺服器記錄遊戲事件
2. **儲存**：回放以二進位檔案形式儲存在 `replays/` 目錄中
3. **元資料**：回放資訊儲存在伺服器記憶體中以供快速存取
4. **擷取**：可透過經過認證的 HTTP 端點存取回放

### 檔案結構
```
replays/
├── replay_1234567890_1678886400.bin
├── replay_1234567891_1678886500.bin
└── ...
```

### 回放資訊
每個回放包含：
- 唯一的回放 ID
- 玩家名稱
- 歌曲 ID
- 建立時間戳
- 檔案大小
- 二進位遊戲資料

## 開發

### 從原始碼構建
```bash
# 克隆倉庫
git clone <repository-url>
cd cpp-phira-mp

# 安裝依賴（Ubuntu/Debian 範例）
sudo apt-get install -y g++ make liblua5.4-dev uuid-dev

# 構建
make

# 執行測試（若有）
make test
```

### 程式碼結構
```
cpp-phira-mp/
├── include/              # 標頭檔
│   ├── server.h         # 伺服器核心定義
│   ├── session.h        # 會話管理
│   ├── room.h           # 房間系統
│   ├── commands.h       # 二進位協定命令
│   ├── http_server.h    # HTTP 伺服器
│   ├── lua_bindings.h   # Lua API 繫結
│   └── ...
├── src/                 # 原始檔
│   ├── server.cpp       # 伺服器實作
│   ├── session.cpp      # 會話處理
│   ├── http_server.cpp  # HTTP API 實作
│   ├── lua_bindings.cpp # Lua 整合
│   └── ...
├── plugins/             # Lua 插件
│   ├── http-admin-api/
│   ├── replay-recorder/
│   ├── admin-commands/
│   ├── advanced-room-management/
│   └── virtual-room/
├── replays/             # 回放儲存
├── locales/             # 在地化檔案
├── Makefile             # 構建配置
├── server_config.yml    # 伺服器配置
└── README.md            # 本文件
```

### 擴充伺服器

#### 新增命令
1. 在 `include/commands.h` 中定義命令
2. 在 `src/session.cpp` 中實作處理
3. 如有需要，新增插件鉤子

#### 新增 HTTP 端點
1. 在 `src/http_server.cpp` 中新增路由註冊
2. 實作處理函式
3. 使用 curl 或 HTTP 客戶端測試

#### 建立新插件
1. 在 `plugins/` 中建立目錄
2. 新增包含元資料的 `plugin.json`
3. 編寫包含插件邏輯的 `init.lua`
4. 在配置中啟用

## 故障排除

### 常見問題

**伺服器無法啟動：**
- 檢查埠可用性：`sudo lsof -i :12346`
- 驗證依賴：`ldd phira-mp-server`
- 檢查權限：`chmod +x phira-mp-server`

**插件未載入：**
- 驗證插件目錄結構
- 檢查 `plugin.json` 語法
- 在配置中啟用插件
- 檢查 Lua 版本相容性

**HTTP API 無法存取：**
- 確認 HTTP 伺服器正在埠 61234 上執行
- 檢查防火牆規則
- 本機測試：`curl http://localhost:61234/stats`

**記憶體使用量過高：**
- 檢查插件中的記憶體洩漏
- 使用 `top` 或 `htop` 監控
- 如有需要，調整連線限制

### 日誌
伺服器將日誌輸出到 stdout。重要事件包括：
- 伺服器啟動和關閉
- 使用者連線/斷開連線
- 房間建立/刪除
- 插件載入/啟用
- HTTP 請求處理

對於生產環境，將日誌重新導向到檔案：
```bash
./phira-mp-server > /var/log/phira-server.log 2>&1 &
```

## 貢獻指南

### 開發流程
1. Fork 倉庫
2. 建立功能分支（`git checkout -b feature/amazing-feature`）
3. 提交變更（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 開啟 Pull Request

### 程式碼標準
- **C++20** 並採用現代實務
- **RAII** 用於資源管理
- **const 正確性** 在適用之處
- **有意義的命名** 用於變數/函式
- **註解** 用於複雜邏輯

### 測試
- 徹底測試新功能
- 驗證向後相容性
- 使用多個同時連線的客戶端進行測試
- 驗證 HTTP API 回應

## 許可證

本專案採用 MIT 許可證 - 詳情請參閱 [LICENSE](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/LICENSE) 檔案。

```text
MIT License

Copyright (c) 2026 HyperSynapseNetwork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 致謝

- **原始 phira-mp** - 提供協定規範與靈感
- **Lua 社群** - 提供強大的指令碼語言
- **開源貢獻者** - 提供各種函式庫和工具
- **HyperSynapseNetwork** - 提供專案贊助與開發支援
- **tphira-mp** - 為本專案提供了大量英文參考
- **jphira-mp** - 為本專案提供了大量英文參考



---

**注意**：本伺服器正在積極開發中。功能和 API 可能會隨著開發進展而變化。請始終查閱您特定版本的文件。
