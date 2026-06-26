# Phira-mp + 專案概覽

## 專案結構

```
Phira-mp-plus/
│
├── Cargo.toml                   # 工作區根 (workspace)
├── Cargo.lock
├── LICENSE                      # AGPL-3.0
├── README.md
│
├── server_config.yml            # YAML 設定檔（首次執行自動產生預設範本）
├── data/                        # 執行時期資料目錄
│   ├── extensions.json          #   插件擴展資料持久化
│   ├── rounds/                  #   輪次 Touches/Judges 記錄
│   └── plugins/                 #   插件私有資料
├── log/                         # 執行日誌（每小時輪轉）
│
├── phira-mp-plus-server/        # 伺服端核心
│   ├── Cargo.toml               #   axum / tokio / wasmtime / clap 等依賴
│   ├── locales/                 #   Fluent i18n 翻譯檔案
│   │   ├── en-US.ftl
│   │   ├── zh-CN.ftl
│   │   └── zh-TW.ftl
│   └── src/
│       ├── main.rs              #   程序入口與生命週期
│       ├── logging.rs           #   tracing 輸出與日誌輪轉
│       ├── terminal.rs          #   終端能力偵測與 Screen 降級策略
│       ├── lib.rs               #   模組匯出
│       ├── server.rs            #   伺服器核心: PlusConfig / PlusServerState / PlusServer
│       │                        #     accept 迴圈、壓力測試方法、狀態查詢分發
│       ├── session.rs           #   會話管理: Session / User 模型、認證、命令處理
│       │                        #     Touches/Judges 資料流向插件事件 + 磁碟儲存
│       ├── room.rs              #   房間狀態機: InternalRoomState / Room
│       │                        #     選譜→準備→遊玩→結算、玩家即時資料快取
│       ├── plugin.rs            #   插件管理器 + WASM 宿主: PluginManager / PluginHost trait
│       │                        #     插件載入、事件分發、CLI/HTTP/API 註冊
│       ├── plugin_http.rs       #   HTTP 服務裝配與動態請求分發
│       ├── plugin_http/
│       │   ├── router.rs        #   動態路由匹配
│       │   ├── sse.rs           #   SSE 事件匯流排、快照與流轉換
│       │   └── websocket.rs     #   即時 WebSocket 橋接
│       ├── wasm_host.rs         #   WASM 執行時期: wasmtime 實例、JSON ABI、host/api 橋接
│       ├── extensions.rs        #   擴展資料系統: 使用者/房間 KV 儲存 + auth 快取持久化
│       ├── ban.rs               #   黑名單系統: 全域封禁 + 房間黑名單
│       ├── round_store.rs       #   輪次資料儲存: JSONL 格式、按 round_uuid/player_id 組織
│       ├── rate_limiter.rs      #   速率限制: 滑動視窗 (連線) + 令牌桶 (命令)
│       ├── cli.rs               #   CLI 命令處理器: 30+ 管理命令、插件擴展命令
│       ├── cli_tui.rs           #   TUI 終端介面: ratatui + crossterm
│       └── l10n.rs              #   在地化: Fluent Bundle / tl! 巨集
│
├── phira-mp-plus-server-api/    # WASM 插件共享型別 crate
│   └── src/lib.rs               #   PluginEvent / PluginInfo / HttpHandle
│                                #   ServerStateQuery / PluginApiHandler
│
├── phira-mp/                    # 上游 phira-mp 子模組（協定層與原始服務端）
│   ├── phira-mp-common/         #   網路協定: 二進位編碼 (BinaryData trait)、
│   │   └── src/                 #     命令定義 (ClientCommand / ServerCommand)、
│   │       ├── lib.rs           #     Stream 幀協定、RoomId / RoomState / 訊息類型
│   │       ├── command.rs
│   │       ├── bin.rs           #     BinaryReader / BinaryWriter (LEB128, 小端)
│   │       └── framing.rs       #     打包/拆包 (VARINT 長度前綴)
│   ├── phira-mp-macros/         #   #[derive(BinaryData)] 程序巨集
│   ├── phira-mp-server/         #   原始單機服務端 (reference)
│   └── phira-mp-client/         #   TCP 客戶端函式庫 (供遊戲整合)
│
├── docs/                        # 本地文件
│   ├── cli.md                   #   CLI 命令參考
│   └── plugin-dev.md            #   WASM 插件開發指南 + WIT API 參考
│
└── server_config.yml            # YAML 設定檔 (同級副本, 執行時讀取)
```

## 終端相容性

啟動時會檢測 stdin/stdout、`TERM`、`STY` 與 `TMUX`。GNU Screen 自動切換到逐行相容控制臺，不啟用顏色、備用螢幕、滑鼠捕獲或 Bracketed Paste；tmux 仍可使用完整 TUI。專案同時遵循 `NO_COLOR`，逐行輸出會再次過濾殘留控制序列。非互動環境同樣使用逐行控制臺。

## SSE 房間事件

`GET /rooms/listen` 建立連線後先發送 `ready`，隨後以 `update_room` 補發當前房間快照，再持續推送 `create_room`、`update_room`、`join_room`、`leave_room` 和 `new_round`。可用下列命令直接檢查資料流：

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

## 建構特性

| 特性 | 說明 | 預設 |
|------|------|------|
| `plugin-system` | WASM 插件支援（wasmtime） | 是 |

## 設定參考

完整的設定項見 `server_config.yml`：

| 設定項 | 型別 | 預設值 | 說明 |
|--------|------|--------|------|
| `port` | u16 | `12346` | TCP 監聽埠 |
| `http_port` | u16 | `12347` | HTTP/SSE 服務埠 |
| `monitors` | Vec\<i32\> | `[2]` | 允許旁觀的使用者 ID |
| `phira_api_endpoint` | String | `https://phira.5wyxi.com` | Phira API 端點 |
| `plugins_dir` | String | `plugins` | 插件目錄 |
| `chat_enabled` | bool | `true` | 聊天功能開關 |
| `cli_enabled` | bool | `true` | CLI 控制臺開關 |
| `connection_rate_limit` | u32 | `30` | 連線速率限制（視窗內允許次數） |
| `connection_rate_window` | u32 | `10` | 連線速率統計視窗（秒） |
| `max_users_per_room` | usize | `8` | 每房間最大玩家數 |
| `round_data_retention_days` | u32 | `7` | 輪次 Touches/Judges 保留天數（0=不保留） |
| `server_name` | String | — | 伺服器名稱 |
