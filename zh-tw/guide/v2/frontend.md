# HSNPhira Frontend

HyperSynapse Network Phira多人遊戲伺服器前端應用

## 項目簡介

> 本項目由多個頂尖AI研究所提供技術支援<br>
> 本項目使用了多種AI工具進行開發

這是一個基於 Vue 3 + TypeScript + Tailwind CSS 構建的現代化Web應用，為HSNPhira多人遊戲伺服器提供完整的前端介面。
HSNPhira Frontend由HSNPhira Backend與phira-mp-logprocessor提供後端支援

## 技術棧

- **框架**: Vue 3 (Composition API)
- **語言**: TypeScript
- **建構工具**: Vite
- **樣式**: Tailwind CSS
- **狀態管理**: Pinia
- **路由**: Vue Router
- **HTTP客戶端**: Axios
- **靜態站點生成 (SSG)**: vite-ssg

## 項目結構

```
HSNPhira/
├── public/                     # 靜態資源
│   ├── config/                # 配置文件
│   │   ├── app.config.json    # 應用配置（API路由、外部服務地址等）
│   │   ├── preferences.config.json  # 用戶偏好配置
│   │   ├── version.json       # 版本資訊（用於自動更新檢查）
│   │   ├── global.config.json       # 全局配置（伺服器地址、QQ群等）
│   │   ├── download.config.json    # 下載頁面配置
│   │   ├── navigation.config.json  # 導航頁面配置
│   │   ├── announcement.config.json # 公告頁面配置
│   │   ├── about.config.json       # 關於我們頁面配置
│   │   └── docs.config.json        # 文檔頁面配置
│   ├── docs/                  # 文檔目錄
│   │   └── guide.md          # 指南文檔
│   ├── images/               # 圖片資源
│   ├── .well-known/          # 數字資產連結
│   │   └── assetlinks.json   # Android數字資產連結文件
│   └── index.html            # 主HTML文件
├── src/                       # Vue前端原始碼
│   ├── api/                  # API介面層
│   │   ├── index.ts          # API客戶端配置
│   │   ├── server.ts         # 伺服器API封裝
│   │   ├── charts.ts         # 譜面相關API
│   │   └── auth.ts           # 認證相關API
│   ├── components/           # 可複用元件
│   │   ├── common/          # 通用元件
│   │   │   ├── Button.vue      # 按鈕元件
│   │   │   ├── Header.vue      # 頭部導航元件
│   │   │   ├── Footer.vue      # 底部元件
│   │   │   ├── Message.vue     # 消息提示元件
│   │   │   └── Table.vue       # 表格元件
│   │   ├── windows/         # 視窗元件（模態框、彈窗）
│   │   │   ├── Window.vue                # 基礎視窗元件
│   │   │   ├── WindowChart.vue           # 譜面詳情視窗
│   │   │   ├── WindowChartDownload.vue   # 譜面下載視窗
│   │   │   ├── WindowRoomHistory.vue     # 遊玩歷史視窗
│   │   │   ├── WindowAuth.vue            # 認證視窗
│   │   │   ├── WindowRoomPlayers.vue     # 房間玩家視窗
│   │   │   └── WindowManager.vue         # 視窗管理器
│   │   ├── background/      # 背景效果元件
│   │   ├── Lightbox.vue     # 圖片燈箱元件
│   │   ├── ServerStatus.vue # 伺服器狀態元件
│   │   └── PageUpdate.vue   # 頁面更新提示元件
│   ├── i18n/                 # 國際化配置
│   │   └── index.ts         # 多語言翻譯文件（支援zh、zh-TW、en、ja）
│   ├── router/               # 路由配置
│   ├── stores/               # 狀態管理（Pinia）
│   │   ├── index.ts         # 用戶狀態管理
│   │   ├── i18n.ts          # 國際化狀態管理
│   │   ├── theme.ts         # 主題狀態管理（深色/淺色/高對比度）
│   │   └── windowManager.ts # 視窗管理器狀態
│   ├── utils/                # 工具函數
│   │   ├── config.ts        # 配置文件載入和解析工具
│   │   ├── docs.ts          # 文檔處理工具
│   │   ├── meta.ts          # Meta標籤和SEO管理工具
│   │   ├── message.ts       # 消息工具函數
│   │   └── eventBus.ts      # 事件匯流排工具
│   ├── types/                # TypeScript類型定義
│   ├── styles/               # 全局樣式
│   │   └── main.css         # Tailwind CSS和自訂樣式
│   ├── views/                # 頁面視圖元件
│   │   ├── Home.vue         # 主頁
│   │   ├── RoomList.vue     # 房間列表
│   │   ├── ChartRanking.vue # 譜面排行榜
│   │   ├── UserRanking.vue  # 用戶排行榜
│   │   ├── Announcement.vue # 公告頁面
│   │   ├── Agreement.vue    # 用戶協議頁面
│   │   ├── Account.vue      # 帳戶管理頁面
│   │   ├── PhiraDownload.vue  # Phira下載頁面
│   │   ├── ChartDownload.vue  # 譜面下載頁面
│   │   ├── Navigation.vue     # 導航頁面
│   │   ├── About.vue          # 關於我們頁面
│   │   ├── DocsHome.vue       # 文檔主頁
│   │   ├── DocPage.vue        # 文檔詳情頁
│   │   └── NotFound.vue       # 404頁面
│   ├── App.vue               # 根元件
│   ├── main.ts               # 應用入口
│   └── vite-env.d.ts         # Vite環境類型定義
├── HSNPM/                     # Rust通知服務（WebPush後端）
│   ├── src/                  # Rust原始碼
│   │   └── main.rs           # 主程式入口
│   ├── .env.example          # 環境變數範例
│   ├── Cargo.toml            # Rust依賴配置
│   ├── Cargo.lock            # 依賴鎖定文件
│   ├── docker-compose.yml    # Docker Compose配置
│   ├── Dockerfile            # Docker建構配置
│   └── README.md             # HSNPM使用文檔
├── scripts/                   # 建構和部署腳本
│   ├── update-download-config.js # 更新下載配置腳本
│   ├── setup-webpush.sh      # WebPush配置腳本
│   ├── generate-icons.js     # PWA圖示生成腳本
│   ├── generate-seo-files.js # SEO文件生成腳本
│   ├── deploy-to-server.sh   # 伺服器部署腳本
│   ├── deploy-hsnpm-start.sh # HSNPM啟動腳本
│   ├── deploy-hsnpm-systemd.service # HSNPM systemd服務配置
│   └── verify-deployment.sh  # 部署驗證腳本
├── images/                    # 項目圖片資源
│   └── deploy-result.jpg     # 部署效果截圖
├── .github/workflows/        # GitHub Actions工作流
│   ├── build-on-push.yml     # 建構工作流
├── package.json              # Node.js項目依賴和腳本
├── pnpm-lock.yaml            # pnpm依賴鎖定文件
├── tsconfig.json             # TypeScript配置
├── tsconfig.node.json        # Node.js環境TypeScript配置
├── vite.config.ts            # Vite建構配置（包含API代理、PWA支援）
├── tailwind.config.js        # Tailwind CSS配置
├── postcss.config.js         # PostCSS配置
├── .env.development          # 開發環境變數（API目標地址）
├── index.html                # 主HTML文件（Vite入口）
├── README.md                 # 項目主文檔
└── LICENSE                   # 許可證文件
```

**說明**：
- 項目採用模組化設計，關注點分離清晰
- API層統一管理所有網路請求，便於維護和測試
- 元件按功能分類，windows元件用於模態互動
- 國際化配置集中管理，支援多語言切換
- 狀態管理使用Pinia，替代Vuex
- 樣式基於Tailwind CSS，支援響應式設計
- 新增的配置文件系統支援動態頁面內容管理
- 新增PWA支援，可將頁面安裝為獨立應用
- 新增深色模式、高對比度模式主題切換
- 新增文檔中心，支援Markdown格式文檔渲染
- 新增Schema結構化資料，最佳化SEO
- 新增行動端全屏選單，支援滾動條

- `public/.well-known/` - 數字資產連結文件目錄，包含`assetlinks.json`

## 快速開始

### 環境要求

- **Node.js** >= 16.0.0（推薦使用18.x或20.x LTS版本）
- **包管理器**: pnpm >= 8.0.0

### 安裝依賴

```bash
# 如果未安裝pnpm，請先安裝（推薦方式）
npm install -g pnpm

# 安裝項目依賴
pnpm install

# 或使用npm（不推薦，可能導致依賴衝突）
# npm install
```

### 配置後端API

**重要**: 在啟動項目前，需要配置後端API地址。項目支援兩種配置方式：

#### 1. 開發環境變數配置（推薦用於本地開發）
編輯 `.env.development` 文件：

```bash
# 後端API伺服器地址（預設本地開發地址）
VITE_API_TARGET=http://localhost:8080

# 啟用Vite代理（推薦開發時啟用）
VITE_USE_PROXY=true
```

**配置說明**：
- `VITE_API_TARGET`: 後端伺服器地址，開發時通常為 `http://localhost:8080`
- `VITE_USE_PROXY`: 是否啟用Vite開發代理，啟用後特定API路徑將透過Vite轉發到後端

#### 2. 應用配置文件（推薦用於生產環境）
編輯 `public/config/app.config.json`：

```json
{
  "apiMode": "remote",                    // "local" 或 "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

**兩種配置的互動**：
- **本地開發推薦配置**：`apiMode: "local"` + `VITE_USE_PROXY=true` + `VITE_API_TARGET=http://localhost:8080`
- **連接遠端伺服器**：`apiMode: "remote"` + `VITE_USE_PROXY=false`
- **生產環境**：根據實際部署位置設定 `apiMode`（前端建構後，透過修改配置文件切換目標伺服器）

**注意**：當 `VITE_USE_PROXY=true` 時，開發代理會覆蓋部分 `apiMode` 配置。詳細說明請查看[API整合](#api整合)章節。

### 開發模式

```bash
# 啟動開發伺服器
pnpm dev
# 或 npm run dev

# 應用將在 http://localhost:3000 啟動
```

**開發注意事項**：
1. **確保後端執行**：啟動前端前，確保後端伺服器已在 `http://localhost:8080` 執行（或您配置的地址）
2. **代理配置**：如果 `VITE_USE_PROXY=true`，API請求將自動代理到後端
3. **熱重載**：程式碼修改會自動重新整理頁面，提高開發效率
4. **主控台輸出**：開發伺服器會顯示建構錯誤和TypeScript檢查結果

### 建構生產版本

```bash
# 執行TypeScript類型檢查並建構（標準 SPA 模式）
pnpm build
# 或 npm run build

# 建構產物將輸出到 dist/ 目錄
```

**建構說明**：
- 建構過程會執行 `vue-tsc` 進行類型檢查，確保TypeScript程式碼正確性
- 生產建構會最佳化程式碼、壓縮資源、生成sourcemap
- 建構產物為純靜態文件，可部署到任何Web伺服器

### 建構 SSG（靜態站點生成）版本

```bash
# 預渲染所有靜態路由為 HTML 文件（SSG 模式）
pnpm build:ssg
# 或 npm run build:ssg
```

**SSG 說明**：

SSG（Static Site Generation）會在建構時將每個路由預渲染為對應的 `index.html` 文件，輸出到 `dist/` 目錄。相比普通 SPA 建構，SSG 的優勢包括：

- **更好的 SEO**：搜尋引擎爬蟲可以直接抓取完整的 HTML 內容，無需等待 JS 執行
- **更快的首屏載入**：用戶首次訪問即可獲得完整的 HTML，無需等待 Vue 渲染
- **社交分享友好**：各平台的 Open Graph 爬蟲可正確解析頁面 meta 資訊

**預渲染的路由**（不含需要登入的動態路由）：

| 路由 | 輸出文件 |
|------|---------|
| `/` | `dist/index.html` |
| `/rooms` | `dist/rooms/index.html` |
| `/chart-ranking` | `dist/chart-ranking/index.html` |
| `/user-ranking` | `dist/user-ranking/index.html` |
| `/agreement` | `dist/agreement/index.html` |
| `/announcement` | `dist/announcement/index.html` |
| `/chart-download` | `dist/chart-download/index.html` |
| `/phira-download` | `dist/phira-download/index.html` |
| `/navigation` | `dist/navigation/index.html` |
| `/about` | `dist/about/index.html` |
| `/docs` | `dist/docs/index.html` |
| `/docs/*` | `dist/docs/*/index.html`（動態生成，根據docs.config.json配置） |
| `/404` | `dist/404/index.html` |

> **注意**：
> - `/account` 路由因需要登入鑑權，不參與 SSG 預渲染，仍以 SPA 方式在客戶端渲染。
> - `/docs/*` 路由為動態生成，根據 `docs.config.json` 配置生成對應的文檔頁面。
> - `/404` 頁面用於處理不存在的路由。

**部署 SSG 產物**：SSG 建構產物與普通建構完全相容，可以用相同的 Nginx/Apache 配置部署。需保留 `try_files $uri $uri/ /index.html;` 以確保 SPA 回退路由正常工作。

### 預覽生產建構

```bash
# 本地預覽生產建構結果
pnpm preview
# 或 npm run preview

# 預覽服務將在 http://localhost:4173 啟動
```

**預覽功能**：
- 使用Vite的預覽伺服器，模擬生產環境
- 檢查建構產物是否正確執行
- 驗證API代理在生產環境下的行為

## 配置說明

### 應用配置 (public/config/app.config.json)

```json
{
  "apiMode": "remote",                    // API模式: local（本地）或 remote（遠端）
  "remoteBaseURL": "https://phira.htadiy.com",  // 遠端API伺服器地址
  "localBaseURL": "http://localhost:8080",      // 本地開發伺服器地址
  "routes": {                              // API路由配置
    "auth": { "login": "/api/auth/login", ... },
    "rooms": { "list": "/api/rooms/info", ... },
    "charts": {
      "rank": "/chart/:id/rank",
      "chartRank": "/topchart/chart_rank/:chart_id",
      "hotRank": "/topchart/hot_rank/:timeRange"  // 注意：完整路徑
    },
    "playtime": { "leaderboard": "/rankapi/playtime_leaderboard" }
  },
  "externalAPI": {
    "phiraBaseURL": "https://phira.5wyxi.com"  // 外部Phira API地址
  },
  "background": {
    "defaultImageURL": "https://webstatic.cn-nb1.rains3.com/5712×3360.jpeg"
  }
}
```

### 用戶偏好配置 (public/config/preferences.config.json)

支援以下自訂選項:
- 主題顏色
- 毛玻璃背景透明度
- 背景粒子效果
- 背景圖片
- 顯示語言

### 全局配置 (public/config/global.config.json)

配置全局共享資訊：
- 全局Phira伺服器地址
- 全局QQ群號
- 統一頁面中的伺服器地址和聯繫資訊顯示

### 下載頁面配置 (public/config/download.config.json)

配置Phira下載頁面：
- 最新版本號（如v0.6.7）
- 下載卡片配置（標題、介紹、按鈕文字、按鈕連結的多語言支援）

### 導航頁面配置 (public/config/navigation.config.json)

配置導航頁面的卡片組和卡片：
- 卡片組（官方、連線伺服器、社群開源倉庫）的多語言名稱
- 卡片的多語言標題和連結

### 公告頁面配置 (public/config/announcement.config.json)

配置公告頁面的公告卡片：
- 公告標題、時間、正文的多語言支援
- 支援動態添加和修改公告

### 關於我們頁面配置 (public/config/about.config.json)

配置關於我們頁面：
- 團隊介紹文字的多語言支援
- 團隊成員資訊（名稱、頭像、主頁連結）
- 致謝列表（名稱、頭像ID、貢獻描述）

### 文檔頁面配置 (public/config/docs.config.json)

配置文檔中心：
- 文檔ID、路由名、頁面標題、meta標籤
- 文檔檔案地址映射
- 支援動態添加文檔

## API整合

項目已預配置以下API端點，並已配置Vite開發代理：

### API端點配置
- 認證: `/api/auth/*`
- 房間: `/api/rooms/*`
- 排行榜: `/rankapi/playtime_leaderboard`
- 譜面資訊: `/chart/*`
- 譜面排名: `/topchart/chart_rank/*`
- 譜面熱門排行: `/topchart/hot_rank/*`（注意：路徑為 `/topchart/hot_rank/`）
- 用戶排行: `/user_rank/*`

### API模式配置（apiMode）
應用支援兩種API模式，透過 `public/config/app.config.json` 中的 `apiMode` 配置：

```json
{
  "apiMode": "remote",                    // "local" 或 "remote"
  "remoteBaseURL": "https://phira.htadiy.com",
  "localBaseURL": "http://localhost:8080"
}
```

- **local 模式**：API請求發送到 `localBaseURL`（通常為本地開發伺服器）
- **remote 模式**：API請求發送到 `remoteBaseURL`（生產伺服器）

**注意**：在開發環境中，此配置的行為受 `VITE_USE_PROXY` 環境變數影響：
- 當 `VITE_USE_PROXY=true`（預設）時，開發伺服器會代理特定路徑到 `VITE_API_TARGET`，覆蓋部分 `apiMode` 配置
- 當 `VITE_USE_PROXY=false` 時，`apiMode` 配置會完全生效

### 開發代理配置
在 `vite.config.ts` 中已配置以下代理規則（當 `VITE_USE_PROXY=true` 時生效）：

```javascript
proxy: {
  '/api': { target: 'http://localhost:8080' },
  '/rankapi': { target: 'http://localhost:8080' },
  '/chart': { target: 'http://localhost:8080' },
  '/topchart/hot_rank': { target: 'http://localhost:8080' },
  '/topchart/chart_rank': { target: 'http://localhost:8080' },
  '/chart_rank': { target: 'http://localhost:8080' },
  '/user_rank': { target: 'http://localhost:8080' }
}
```

**代理與apiMode的互動**：
- 開發環境中，對於使用Axios API實例的請求，代理會接管並忽略 `apiMode`
- 開發環境中，直接使用 `fetch()` 的請求會遵循 `apiMode` 配置
- 生產環境中，所有請求都遵循 `apiMode` 配置

### 外部API
部分功能（如譜面詳情、用戶頭像）會直接呼叫外部Phira API（`https://phira.5wyxi.com`），這些請求不走代理，也不受 `apiMode` 影響。

### 推薦配置方案
1. **本地開發**：設定 `apiMode: "local"`，`VITE_USE_PROXY=true`，`VITE_API_TARGET=http://localhost:8080`
2. **連接遠端伺服器**：設定 `apiMode: "remote"`，`VITE_USE_PROXY=false`
3. **生產環境**：根據部署位置設定 `apiMode` 為 `local` 或 `remote`

## 部署

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 壓縮最佳化

項目建構時會自動生成 Brotli (`.br`) 和 Gzip (`.gz`) 壓縮文件。要啟用伺服器端預壓縮文件支援，請更新 Nginx 配置：

```nginx
# 在 http 或 server 塊中添加以下配置
gzip_static on;          # 啟用預壓縮的 .gz 文件
brotli_static on;        # 啟用預壓縮的 .br 文件（需要 ngx_brotli 模組）
gzip_vary on;            # 添加 Vary: Accept-Encoding 響應頭

# 如果未安裝 ngx_brotli 模組，可以啟用動態壓縮
# gzip on;
# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
# brotli on;
# brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

完整的 Nginx 配置示例（支援預壓縮文件）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 壓縮最佳化配置
    gzip_static on;
    brotli_static on;
    gzip_vary on;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**注意**：
- 預壓縮文件由 `vite-plugin-compression` 在建構時生成，無需即時壓縮開銷
- 確保 Nginx 編譯時包含 `--with-http_gzip_static_module` 和 `--add-module=/path/to/ngx_brotli`（如需 Brotli 支援）
- 瀏覽器會自動根據 `Accept-Encoding` 請求頭接收合適的壓縮格式


## 開發指南

### 添加新頁面

1. 在 `src/views/` 建立新的 Vue 元件
2. 在 `src/router/index.ts` 添加路由配置
3. 在 `Header.vue` 的 `navRoutes` 陣列中添加導航連結

### 添加新API

1. 在 `src/api/` 建立對應的API模組
2. 在 `src/types/index.ts` 定義相關類型
3. 在元件中匯入並使用

### 自訂樣式

- 全局樣式: `src/styles/main.css`
- Tailwind配置: `tailwind.config.js`
- 主題色透過CSS變數 `--primary-color` 控制

## 瀏覽器支援

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 效果
可以前往 [HSNPhira官網](https://phira.htadiy.com/) 查看部署效果
![部署完成後的首頁](https://github.com/HyperSynapseNetwork/HSNPhira/blob/frontend-remake/images/deploy-result.jpg?raw=true)

## 許可證

本項目採用 GNU Affero General Public License（AGPL）3.0 開源協議。

### 版權聲明
版權所有 © HyperSynapse Network。保留所有權利。

### 開發者義務
根據 AGPL-3.0 協議，使用、修改或分發本項目的開發者必須：
- 保留原項目的版權和許可證聲明。
- 在分发時提供完整的原始碼。
- 任何基於本項目的衍生作品也必須使用 AGPL-3.0 協議開源。

詳細條款請查看 [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html) 許可證全文。

## 聯絡方式

- QQ群: 1049578201
- 郵箱: nb3502022@outlook.com
- GitHub: https://github.com/HyperSynapseNetwork/HSNPhira

## 致謝

感謝以下朋友為本項目做出的貢獻，沒有他們就沒有本項目的現在（排名不分先後，如有遺漏非常抱歉）：

### 開發貢獻
感謝以下開發者為項目開發、測試與資助做出的貢獻：
*   **[TeamFlos](https://github.com/TeamFlos)**
    *   原項目 **Phira**：[Phira](https://github.com/TeamFlos/Phira)
    *   原項目 **Phira-MP**：[Phira-MP](https://github.com/TeamFlos/Phira-MP)
*   **[htadiy](https://github.com/htadiy)**
*   **[ExplodingKonjac](https://github.com/ExplodingKonjac)**
*   **[LY-Xiang](https://github.com/LY-Xiang)**
*   **[AFewSuns](https://github.com/AFewSuns)**

### 設計、資助與支持
*   感謝 **Ght/F=1** 參與設計了本項目圖示。 **[Dmocken](https://github.com/Dmocken)** 為本項目宣傳與監控伺服器狀態提供了支援。
*   感謝 **其他所有為本項目提供過支持的捐獻者** 。
*   感謝 **所有使用過HSNPhira提供的服務的玩家** 。

### 社群貢獻
感謝其他所有為 Phira 開源社群生態做出貢獻的開發者！

### 特別感謝
感謝 **Claude** 與 **Deepseek** 對本項目的支援。
感謝 **雨雲** 對本項目的支援
