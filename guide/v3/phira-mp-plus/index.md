# Phira-mp +

[Phira-mp +](https://github.com/HyperSynapseNetwork/Phira-mp-plus) 是基于 [phira-mp](https://github.com/HyperSynapseNetwork/phira-mp) 扩展的 Phira 多人游戏服务端，提供 WASM 插件、管理控制台、HTTP API 与监控数据流。

## 核心特性

- **WASM 插件系统** — 基于 wasmtime 动态加载，通过 `phira:host/api` 访问全部服务端能力
- **TUI 管理控制台** — 基于 `ratatui` + `crossterm` 的终端界面，支持命令输入、日志实时显示
- **内置功能** — 房间信息 Web API、黑名单管理、轮次数据持久化、速率限制等均集成在核心中

## 技术栈

| 技术 | 用途 |
|------|------|
| Rust | 主开发语言（2021 Edition） |
| Tokio | 异步运行时 |
| ratatui + crossterm | TUI 终端界面 |
| Clap | CLI 参数解析 |
| Axum | HTTP/SSE 服务器 |
| wasmtime | WASM 运行时（可选） |
| fluent | 本地化 (i18n) |
| reqwest | HTTP 客户端 |
| tracing | 日志与诊断 |

## 快速开始

```bash
# 安装/更新 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable

# 克隆仓库
git clone https://github.com/HyperSynapseNetwork/Phira-mp-plus.git
cd Phira-mp-plus

# 构建（首次编译约需 2-5 分钟）
cargo build

# 启动（debug 模式）
./target/debug/phira-mp-plus-server

# 指定配置文件
./target/debug/phira-mp-plus-server --config my_config.yml
```

## 文档

- [CLI 命令参考](/guide/v3/phira-mp-plus/cli) — 启动参数与交互式命令
- [API 文档](/guide/v3/phira-mp-plus/api) — HTTP API 与 SSE 端点
- [WASM 插件开发](/guide/v3/phira-mp-plus/plugin-dev) — 插件开发指南
- [项目结构与配置](/guide/v3/phira-mp-plus/readme) — 项目结构、终端兼容性、配置参考

## 许可

AGPLv3
