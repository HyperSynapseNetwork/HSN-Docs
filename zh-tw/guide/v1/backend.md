# HSNPhira v1 後端

HSNPhira v1 後端採用 Python Flask 框架，由多個獨立微服務組成，提供用戶管理、房間監控、命令執行和檔案服務等功能。

## 服務架構概覽

| 服務 | 連接埠 | 技術棧 | 說明 |
|------|------|--------|------|
| user_manager | 2345 | Flask + SQLite | 用戶註冊/登入/資訊管理，Phira 資料同步 |
| room | 5000 | Flask + 日誌解析 | 即時房間狀態監控（日誌驅動） |
| api | 5001 | Flask + SQLite | 房間資料採集與統計分析（API 驅動） |
| command | 7878 | Flask | 安全命令執行（白名單 + 密碼驗證） |
| file | 7880 | Flask | 檔案內容服務 |

---

## 1. user_manager (連接埠 2345)

用戶帳號管理核心服務。

### 功能

- **用戶註冊** (`POST /register`) — 綁定 Phira 帳號註冊，密碼加鹽哈希儲存
- **用戶登入** (`POST /login`) — 密碼驗證，返回用戶資訊
- **用戶資訊查詢** (`POST /info`) — 管理員/超級管理員權限可查詢
- **用戶資訊修改** (`POST /info_changer`) — 修改用戶名、密碼、Phira ID、權限等
- **管理員介面** — 用戶列表查詢、單用戶更新、批次更新
- **Phira 資料同步** — 後台執行緒定時從 `phira.5wyxi.com` API 更新用戶頭像和 RKS

### 資料庫

- **檔案**: `phira_users.db` (SQLite)
- **表 `users`**: id, name, phira_id, phira_name, phira_rks, image_url, password(哈希), admin, dev, created_at

### 認證

| 角色 | 憑證 | 權限 |
|------|------|------|
| 超級管理員 | 固定密碼（程式碼中配置） | 完全控制，可修改密碼/權限欄位 |
| 普通管理員 | 固定密碼（程式碼中配置） | 查用戶資訊，修改非權限欄位 |

---

## 2. room (連接埠 5000)

基於日誌驅動的即時房間狀態監控服務。透過即時讀取 `phira-mp/server.log` 追蹤房間事件。

### 功能

- **日誌監控** — 即時追蹤日誌檔案，解析房間建立/加入/離開/解散事件
- **房間狀態追蹤** — 記錄房間狀態（選譜中/進行中）、循環開關、譜面選擇
- **用戶映射** — 維護 user_id → username 和 user_id → room_name 映射
- **持久化** — 用戶映射關係寫入 `user_info.json`

### API

| 端點 | 說明 |
|------|------|
| `GET /rooms` | 取得所有房間詳細資訊 |
| `GET /status` | 系統狀態（房間數、用戶數） |
| `GET /health` | 健康檢查 |
| `GET /users/total` | 註冊用戶總數統計 |

### 後台執行緒

- **日誌追蹤** (tail_log) — 即時讀取日誌檔案變更
- **房間清理** (room_cleanup_task) — 每 60 秒清理超過 1 小時無活動的房間

---

## 3. api (連接埠 5001)

基於 API 驅動的房間資料採集與統計服務。輪詢 `phira.htadiy.cc/api/rooms/info` 獲取資料。

### 功能

- **房間監控** — 每秒從 Phira API 拉取房間列表並存入資料庫
- **用戶進出追蹤** — 記錄用戶進入/離開房間的時間和停留時長
- **遊戲回合追蹤** — 記錄遊戲開始/結束時間、用戶遊玩時長
- **在線人數統計**

### 資料庫

- **檔案**: `phira_stats.db` (SQLite)
- **表**: rooms, user_room_activity, user_room_duration, game_rounds, user_playtime

| 端點 | 說明 |
|------|------|
| `GET /users` | 當前在線總人數 |

### 後台執行緒

- **房間監控** (room_monitor_service) — 每秒輪詢 API，更新資料庫

---

## 4. command (連接埠 7878)

安全的遠端命令執行服務。

### 功能

- **白名單命令** — 預定義的受控命令（start/restart/stop/serverinfo）
- **自訂命令** — 允許執行任意命令（可透過配置開關）
- **三層密碼驗證** — 需同時提供三個密碼片段進行身份認證
- **危險命令黑名單** — 阻止 rm -rf /、mkfs、shutdown 等危險操作

### API

| 端點 | 說明 |
|------|------|
| `POST /execute` | 執行命令（白名單或自訂） |

### 安全機制

- 所有命令透過 `shlex.split` 安全解析
- 危險命令黑名單攔截
- 密碼使用 `werkzeug.security.check_password_hash` 驗證

---

## 5. file (連接埠 7880)

簡單的檔案內容服務。

### 功能

- 讀取並返回指定路徑的檔案內容（預設 `/root/user_info.json`）
- 支援透過環境變數 `FILE_PATH` 配置目標檔案

### API

| 端點 | 說明 |
|------|------|
| `GET /api` | 返回檔案內容 |

---

## 啟動方式

```bash
# 用戶管理服務
python user_manager.py       # → :2345

# 房間監控服務（日誌驅動）
python room.py               # → :5000

# 房間監控服務（API 驅動）
python api.py                # → :5001

# 命令執行服務
python command.py            # → :7878

# 檔案服務
python file.py               # → :7880
```

## 依賴

- `flask` — Web 框架
- `werkzeug.security` — 密碼哈希
- `sqlite3` — 資料庫（Python 內建）
- `requests` — HTTP 請求（房間 API 採集）
- `threading` — 後台執行緒（Python 內建）
