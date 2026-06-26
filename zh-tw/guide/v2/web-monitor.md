# HSN Phira Web Monitor

這是一個完整的基於 Web 的工具鏈，專為 Phira 設計，提供即時的多人觀戰、用戶同步和房間查詢功能。

本項目主要作為 Phira 多人遊戲房間的代理和 Web 視覺化層，允許用戶直接在瀏覽器中觀看即時渲染的譜面。

## 架構總覽

本項目由 4 個協同工作的主要工作區（workspace）組成：

1. **`monitor-common`**：定義了跨網路層和 WebGL 渲染器使用的共享 Rust 資料結構、二進位解析工具和核心邏輯。
2. **`monitor-proxy`**：基於 Rust Axum 的伺服器，作為官方 Phira 伺服器和瀏覽器客戶端之間的橋樑。它負責用戶認證（JWT）、輪詢房間列表、串流傳輸遠端判定事件（SSE），以及提供譜面二進位檔案。
3. **`monitor-client`**：本專案的 WebAssembly (WASM) 核心。使用 Rust 編寫，解碼 `bincode` 譜面資料，並利用 WebGL 原生計算並渲染 Phira 譜面。
4. **`web`**：一個現代的 Vue 3 + TypeScript 前端應用。它管理 UI 狀態，建立 WebSocket 和 SSE 事件監聽器，協調音訊上下文（AudioContext），並為 WASM WebGL 引擎動態管理畫布（Canvas）尺寸。

---

## 元件詳情與 API 參考

### `monitor-proxy`

代理伺服器，作為應用的主後端。

#### 資料格式定義

所有的介面互動均使用以下 TypeScript 介面定義為基礎：

```typescript
// === 認證與用戶資訊相關 (Auth) ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  phira_avatar: string | null;
  phira_id: number;
  phira_rks: number;
  phira_username: string;
  register_time: string; // ISO 8601 格式的時間字串
  last_login_time: string; // ISO 8601 格式的時間字串
}

// === 房間資訊及列表相關 (Rooms) ===

export interface RoomListResponse {
  total: number; // 房間總數
  rooms: RoomInfoResponse[]; // 房間詳細資訊列表
}

export interface RoomInfoResponse {
  name: string; // 房間 ID 標識符
  data: RoomData;
}

export interface RoomData {
  host: number; // 房主 ID (-1 表示無房主)
  users: number[]; // 房間內用戶 ID 列表
  lock: boolean; // 是否上鎖
  cycle: boolean; // 是否輪換房主
  chart: number | null; // 選中的譜面 ID (null 表示未選)
  state: "SELECTING_CHART" | "WAITING_FOR_READY" | "PLAYING"; // 房間所處狀態
  rounds: RoundData[]; // 房間歷史對局列表
}

export interface RoundData {
  chart: number; // 該對局的譜面 ID (-1 表示無)
  records: RecordData[]; // 該對局的玩家成績列表
}

export interface RecordData {
  id: number;
  player: number;
  score: number;
  perfect: number;
  good: number;
  bad: number;
  miss: number;
  max_combo: number;
  accuracy: number; // 例如 1.0 代表 100%
  full_combo: boolean;
  std: number;
  std_score: number;
}

// === 歷史訪問用戶相關 (Visited Users) ===

export interface VisitedUserListResponse {
  count: number; // 總訪問用戶數
  users?: VisitedUserInfo[]; // 用戶列表（僅在 count_only 為 false 時返回）
}

export interface VisitedUserInfo {
  phira_id: number;
}
```

針對 SSE（`GET /rooms/listen`）的事件定義：

```typescript
// === SSE 房間監聽事件 (SSE) ===

// 房間創建事件
export interface SSEEventCreateRoom {
  room: string;
  data: RoomData;
}

// 房間狀態更新事件
export interface SSEEventUpdateRoom {
  room: string;
  data: Partial<RoomData>; // 資料更新（如果不存在，前台可理解為創建房間）
}

// 玩家加入房間或離開房間事件
export interface SSEEventJoinOrLeaveRoom {
  room: string;
  user: number;
}

// 包含了新的對局結算
export interface SSEEventNewRound {
  room: string;
  round: RoundData;
}
```

#### `GET /chart/{id}`

**說明**：取得指定 `id` 譜面的二進位資料，供 `monitor-client` 解碼使用。

**響應格式**：`application/octet-stream`。

#### `GET /rooms/info`

**說明**：取得當前所有活躍房間的列表。

**響應格式**：`application/json`，格式為 `RoomListResponse`。

#### `GET /rooms/info/{id}`

**說明**：取得指定 `id` 房間的詳細資訊。

**響應格式**：`application/json`，格式為 `RoomInfoResponse`。

#### `GET /rooms/user/{id}`

**說明**：查詢指定用戶（ID）當前所在的房間。

**響應格式**：`application/json`，格式為 `RoomInfoResponse` (如果不在任何房間中則為 `null`)。

#### `GET /visited`

**說明**：取得曾經在本伺服器上創建或加入過房間的用戶資訊。

**查詢參數**：
- `count_only`: (可選, boolean) 是否僅返回總數量。預設為 `false`。

**響應格式**：`application/json`，格式為 `VisitedUserListResponse`。

#### `GET /rooms/listen`

**說明**：用於監聽房間生命週期事件的 Server-Sent Events (SSE) 流。

**響應格式**：`text/event-stream`。

包含的事件類型：

- `create_room`: 發送 `SSEEventCreateRoom` 結構的 JSON 資料。當建立 SSE 連接時，服務端立刻發送若干 `create_room` 事件，表示當前所有房間的狀態。
- `update_room`: 發送 `SSEEventUpdateRoom` 結構的 JSON 資料。
- `join_room`: 發送 `SSEEventJoinOrLeaveRoom` 結構的 JSON 資料。
- `leave_room`: 發送 `SSEEventJoinOrLeaveRoom` 結構的 JSON 資料。
- `new_round`: 發送 `SSEEventNewRound` 結構的 JSON 資料。

#### `POST /auth/login`

**說明**：代理到官方 Phira 認證介面的登入端點。成功後返回一個 JWT Token，前端需要保存該 Token 用於後續的認證請求。

**請求格式**：`application/json`，格式為 `LoginRequest`。

**響應格式**：`application/json`，格式為 `LoginResponse`。

#### `GET /auth/me`

**說明**：取得當前 JWT Token 對應的用戶資料資料（在 Phira 原生資料的快取）。需要在請求頭中攜帶 `Authorization: Bearer <token>`。

**響應格式**：`application/json`，格式為 `ProfileResponse`。

---

## 開發指南

在本地開發本項目，請確保已安裝 **Rust**、**Node.js (v18+)** 和 **wasm-pack**。

1. **編譯 WASM 客戶端：**

```bash
cd monitor-client
wasm-pack build --out-dir ../web/pkg --target web
```

2. **執行前端 (Vue)：**

```bash
cd web
npm install
npm run dev
```

3. **執行代理後端：**

_(注意先設定好本地開發用的 secret key)_

```bash
export HSN_SECRET_KEY=dev_secret_local
cargo run --bin monitor-proxy -- --debug
```

---

## 生產部署指南

部署 HSN Phira Proxy 需要編譯靜態的 WebAssembly/Vue 產物，並確保 Rust 伺服器的安全執行。

### 前置要求

- 建構工具：`rustc`、`cargo`、`npm`、`wasm-pack`。
- Web 伺服器（例如 Nginx 或 Caddy），用於託管靜態網頁並反向代理。

### 1. 編譯 WASM 引擎

**此步驟必須最先執行**，因為 Vue 的建構依賴於輸出到 `pkg/` 資料夾中的 WASM 模組。

```bash
cd monitor-client
wasm-pack build --target web --out-dir ../web/pkg --release
```

### 2. 編譯靜態 Web 前端

將 Vue 3 應用編譯為標準的 HTML/JS 靜態檔案。

#### 環境變數配置 (.env)

在 `web` 目錄下進行前端環境變數的配置。對於生產環境，你可以在建構前創建或修改 `.env.production` 檔案：
如果你將前後端分離部署（API 後端並不和網頁託管在同一個域名下），你需要指定前端訪問代理後端的 API 根 URL：

```env
# 示例：代理後端的外部訪問地址
VITE_API_BASE=https://api.yourdomain.com
```

_註：如果不配置或值為空字串 `""`，前端會自動將請求發送至當前網頁所在的同源相對路徑（這非常適合使用 Nginx 統一進行反向代理的情況）。_

```bash
cd web
npm ci
npm run build
```

編譯後最佳化過的前端檔案將被輸出到 `web/dist`。

### 3. 編譯並執行 API 代理後端

使用 release 模式原生編譯 Rust 二進位檔案以獲得最強效能。

```bash
cargo build --release --bin monitor-proxy
```

#### 啟動選項指南

`monitor-proxy` 支援以下命令列參數，可透過 `--help` 查看：

- `--debug`: 開啟除錯模式。開啟後 CORS 安全策略將被直接放寬。
- `--port <PORT>`: 伺服器監聽的連接埠（預設為 `3080`）。
- `--cache-dir <DIR>`: 譜面在硬碟上的快取下載目錄（預設存放在 `~/.cache/hsn-phira`）。
- `--api-base <URL>`: 指向 Phira 官方 API 的抓取地址（預設為 `https://phira.5wyxi.com`）。
- `--mp-server <ADDR>`: Phira 多人遊戲伺服器地址，用於獲取房間資訊（預設為 `localhost:12346`）。
- `--allowed-origin <ORIGIN>`: **在生產環境中必需**。設定明確的跨域資源共享（CORS）允許來源域名（例如 `https://monitor.example.com`）。如果不設定此項配置，則程式無法啟動（除非你開啟了 `--debug`）。

#### 環境變數

Rust 伺服器還需要透過一個 Secret Key 來確保生成用戶 token 時的加密安全，以及用於和 phira-mp 伺服器溝通時的鑑權。在啟動進程前**必須**定義它，**並且要和 phira-mp 設定的相同**。

```bash
export HSN_SECRET_KEY=$(openssl rand -hex 32)
```

啟動伺服器（推薦使用 systemd 或 PM2 等守護行程工具來後台統一管理，並傳入生產參數）：

```bash
./target/release/monitor-proxy --port 8080 --allowed-origin https://monitor.example.com
```

### 4. 反向代理配置（以 Nginx 為例）

配置站點，使得 Web 伺服器能夠高效地託管 Vue 靜態包，同時將 REST API、SSE 和 WebSocket 流量正確代理到後端的 Rust 伺服器。

```nginx
server {
    listen 80;
    server_name monitor.example.com;

    # 託管 Vue 3 靜態產物
    location / {
        root /path/to/hsn-phira/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 將 REST API、SSE 流 和 WebSocket 請求統一代理給 Rust 伺服器
    location /api/ {
        proxy_pass http://127.0.0.1:8080/; # 請根據實際配置的 PORT 調整
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # 針對 WebSocket 的 Upgrade 請求頭配置
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        # 對於 SSE 流（例如 /rooms/listen），必須禁用緩衝機制以防止斷連/延遲
        proxy_buffering off;
        proxy_read_timeout 86400; # 防止長連線掉線
    }
}
```
