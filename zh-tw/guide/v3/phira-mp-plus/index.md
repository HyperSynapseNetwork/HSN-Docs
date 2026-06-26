# Phira-mp +

[Phira-mp +](https://github.com/HyperSynapseNetwork/Phira-mp-plus) 是基於 [phira-mp](https://github.com/HyperSynapseNetwork/phira-mp) 擴充的 Phira 多人遊戲伺服端，提供 WASM 插件、管理控制臺、HTTP API 與監控資料流。

## 核心特性

- **WASM 插件系統** — 基於 wasmtime 動態載入，透過 `phira:host/api` 存取全部伺服端能力
- **TUI 管理控制臺** — 基於 `ratatui` + `crossterm` 的終端介面，支援命令輸入、日誌即時顯示
- **內建功能** — 房間資訊 Web API、黑名單管理、輪次資料持久化、速率限制等均整合在核心中

## 技術棧

| 技術 | 用途 |
|------|------|
| Rust | 主要開發語言（2021 Edition） |
| Tokio | 非同步執行時期 |
| ratatui + crossterm | TUI 終端介面 |
| Clap | CLI 參數解析 |
| Axum | HTTP/SSE 伺服器 |
| wasmtime | WASM 執行時期（可選） |
| fluent | 在地化 (i18n) |
| reqwest | HTTP 客戶端 |
| tracing | 日誌與診斷 |

## 快速開始

```bash
# 安裝/更新 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable

# 克隆倉庫
git clone https://github.com/HyperSynapseNetwork/Phira-mp-plus.git
cd Phira-mp-plus

# 構建（首次編譯約需 2-5 分鐘）
cargo build

# 啟動（debug 模式）
./target/debug/phira-mp-plus-server

# 指定設定檔
./target/debug/phira-mp-plus-server --config my_config.yml
```

## 文件

- [CLI 命令參考](/zh-tw/guide/v3/phira-mp-plus/cli) — 啟動參數與互動式命令
- [API 文件](/zh-tw/guide/v3/phira-mp-plus/api) — HTTP API 與 SSE 端點
- [WASM 插件開發](/zh-tw/guide/v3/phira-mp-plus/plugin-dev) — 插件開發指南
- [項目結構與配置](/zh-tw/guide/v3/phira-mp-plus/readme) — 項目結構、終端相容性、配置參考

## 許可

AGPLv3
