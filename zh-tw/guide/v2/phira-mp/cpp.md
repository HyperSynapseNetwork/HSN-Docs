# cpp-phira-mp

✨基於 [phira-mp](https://github.com/TeamFlos/phira-mp) 重新開發的C++版phira-mp，新增 Web 後臺管理、REST API、SSE 即時事件、封禁系統、適配觀戰系統和連線歡迎資訊。✨

## 特點

### 1. 後臺 Web 管理面板（含密碼保護）
- 瀏覽器訪問 `http://伺服器IP:12347/admin` （預設情況下）
- **登入認證**：首次執行預設密碼 `admin`，請立即修改
- 檢視所有房間列表、房間狀態、玩家人數及列表
- 即時重新整理（每5秒自動更新）
- 一鍵解散任意房間
- 一鍵踢出房間內任意玩家
- 封禁/解封玩家 ID（封禁後連線時顯示「你已被封禁」提示）
- 封禁列表持久化儲存在 `banned_users.json`

### 2. API

| 介面 | 說明 |
|------|------|
| `GET /api/rooms/info` | 獲取所有房間列表及完整資料 |
| `GET /api/rooms/info/<n>` | 獲取指定名稱房間資訊 |
| `GET /api/rooms/user/<user_id>` | 獲取指定使用者所在房間資訊 |
| `GET /api/rooms/listen` | SSE 即時事件流 |

#### SSE 事件型別
| 事件 | 說明 |
|------|------|
| `keepalive` | 保持連線 |
| `create_room` | 新房間建立 |
| `update_room` | 房間資料更新（狀態、鋪面、鎖定、輪換等變化） |
| `join_room` | 使用者加入房間 |
| `leave_room` | 使用者離開房間 |
| `player_score` | 玩家完成遊戲（含完整成績記錄） |
| `start_round` | 房間開始新一輪遊戲 |

SSE 連線內建 15 秒心跳保活機制，防止連線被中介軟體或防火牆斷開。

### 3. 本程式可搭配 [Phira觀戰實現](https://github.com/HyperSynapseNetwork/phira-web-monitor)進行觀戰。

### 4. 連線歡迎資訊
- 使用者認證成功後自動傳送歡迎訊息
- 展示當前可加入的房間列表（僅顯示選圖中且未鎖定的房間）

---

## 編譯前準備

```bash
# 更新套件列表
sudo apt update

# 安裝編譯工具和依賴
sudo apt install -y build-essential g++ curl pkg-config uuid-dev libsqlite3-dev zlib1g-dev libssl-dev libboost-dev libspdlog-dev libargon2-dev libfmt-dev nlohmann-json3-dev libcurl4-openssl-dev make
```

### 所需依賴清單
| 依賴 | Ubuntu 套件名 | 用途 |
|------|------------|------|
| G++ (>=10) | `build-essential` / `g++` | C++20 編譯器 |
| uuid-dev | `uuid-dev` | UUID 生成 |
| curl | `curl` | HTTP 請求（獲取 Phira API 資料） |
| make | `build-essential` | 構建工具 |
| pkg-config | `pkg-config` | 構建工具 |
| Boost | `libboost-dev` | 所需依賴 |
| spdlog | `libspdlog-dev` | 日誌等級實作 |
| Argon2 | `libargon2-dev` | 二進位協定 |
| Json3 | `nlohmann-json3-dev` | Json3 |
| SQLite3 | `libsqlite3-dev` | 使用者ID資料庫實作 |
| Curl-OpenSSL | `libcurl4-openssl-dev` | Curl和OpenSSL實作 |
| OpenSSL | `libssl-dev` | SSL 支援 |

---

## 編譯

```bash
cd cpp-phira-mp
make clean
make -j$(nproc)
```

編譯成功後生成 `phira-mp-server` 可執行檔案。

---

## 下載

你可以前往本專案的 [GitHub Actions](https://github.com/HyperSynapseNetwork/cpp-phira-mp/actions)，下載已編譯好可直接執行的 `exe` 和啟動指令碼。（輸入 `./start.sh` 即可執行）。


---

## 執行

```bash
# 預設埠執行（預設為遊戲埠 12346，Web/api 埠 12347，後臺管理密碼 admin）
./phira-mp-server

# 自訂埠
./phira-mp-server --port 12346 --http-port 12347 --admin-password PASSWORD

```

### 命令列引數
| 引數 | 說明 | 預設值 |
|------|------|--------|
| `--port` | 遊戲伺服器埠 | 12346 |
| `--http-port` | Web 管理/API 埠 | 12347 |
| `--admin-password` | 後臺管理密碼 | admin |
| `--db-path` | 設定資料庫`.db`檔案路徑 | visitors.db |
| `-h, --help` | 顯示幫助 | - |

---

## 檔案結構

```
cpp-phira-mp-main/
├── include/
│   ├── binary.hpp          # 二進位協定
│   ├── command.hpp         # 命令定義
│   ├── http_server.hpp     # HTTP 客戶端
│   ├── l10n.hpp            # 在地化
│   ├── room.hpp            # 房間 + 輪次歷史
│   ├── server.hpp          # 伺服器 + get_state()
│   ├── session.hpp         # 會話
│   ├── stream.hpp          # 觸控資訊流
│   ├── visitor_db.hpp      # 訪客數量記錄
├── src/
│   ├── binary.cpp          # 二進位協定實作
│   ├── command.cpp         # 命令實作
│   ├── http_server.cpp     # Web網頁/API實作
│   ├── l10n.cpp            # 在地化實作
│   ├── main.cpp            # 主入口
│   ├── room.cpp            # 主邏輯實作
│   ├── server.cpp          # 伺服器
│   ├── session.cpp         # 主邏輯實作
    ├── visitor_db.cpp      # 訪客數量記錄
│   └── stream.cpp          # 觀戰協定
│   
├── locales/
│   ├── en-US.ftl
│   ├── zh-CN.ftl
│   └── zh-TW.ftl
├── Makefile
├── CMakeLists.txt
└── README.md
```

### 執行時期檔案
- `banned_user.json` — 封禁玩家 ID 列表（自動建立/管理）

---

## API 使用範例

```bash
# 獲取所有房間
curl http://localhost:12345/api/rooms/info

# 獲取指定房間
curl http://localhost:12345/api/rooms/info/my-room

# 獲取使用者所在房間
curl http://localhost:12345/api/rooms/user/12345

# 監聽即時事件（SSE）
curl http://localhost:12345/api/rooms/listen

```


---

## QQ 群

**1049578201**

## 協議

使用 **MIT** 協議。
