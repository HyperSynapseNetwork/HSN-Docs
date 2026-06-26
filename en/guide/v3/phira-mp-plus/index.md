# Phira-mp +

Phira-mp + is an extended Phira multiplayer game server built on top of phira-mp, featuring WASM plugins, TUI management console, HTTP API, and monitoring data streams.

## Core Features

- **WASM Plugin System** — Dynamic loading via wasmtime, access to all server capabilities through `phira:host/api`
- **TUI Management Console** — Terminal interface with ratatui + crossterm, supports command input and real-time log display
- **Built-in Features** — Room Web API, ban management, round data persistence, rate limiting

## Quick Start

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable

git clone https://github.com/HyperSynapseNetwork/Phira-mp-plus.git
cd Phira-mp-plus

cargo build
./target/debug/phira-mp-plus-server
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Rust (2021 Edition) |
| Async Runtime | Tokio |
| TUI | ratatui + crossterm |
| CLI | Clap |
| HTTP/SSE | Axum |
| WASM Runtime | wasmtime (optional) |
| i18n | fluent |
| HTTP Client | reqwest |
| Logging | tracing |

For detailed documentation, see the [Chinese version](/guide/v3/phira-mp-plus/).
