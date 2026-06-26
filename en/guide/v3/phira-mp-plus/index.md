# Phira-mp +

[Phira-mp +](https://github.com/HyperSynapseNetwork/Phira-mp-plus) is an extended Phira multiplayer game server built on [phira-mp](https://github.com/HyperSynapseNetwork/phira-mp), featuring WASM plugins, a management console, HTTP API, and monitoring data streams.

## Core Features

- **WASM Plugin System** — Dynamically loaded via wasmtime, access all server capabilities through `phira:host/api`
- **TUI Management Console** — Terminal interface built with `ratatui` + `crossterm`, supporting command input and real-time log display
- **Built-in Features** — Room info Web API, ban management, round data persistence, rate limiting, all integrated into the core

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Rust | Main development language (2021 Edition) |
| Tokio | Async runtime |
| ratatui + crossterm | TUI terminal interface |
| Clap | CLI argument parsing |
| Axum | HTTP/SSE server |
| wasmtime | WASM runtime (optional) |
| fluent | Localization (i18n) |
| reqwest | HTTP client |
| tracing | Logging and diagnostics |

## Quick Start

```bash
# Install/Update Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable

# Clone the repository
git clone https://github.com/HyperSynapseNetwork/Phira-mp-plus.git
cd Phira-mp-plus

# Build (first compilation takes about 2-5 minutes)
cargo build

# Start (debug mode)
./target/debug/phira-mp-plus-server

# Specify config file
./target/debug/phira-mp-plus-server --config my_config.yml
```

## Documentation

- [CLI Command Reference](/en/guide/v3/phira-mp-plus/cli) — Startup arguments and interactive commands
- [API Documentation](/en/guide/v3/phira-mp-plus/api) — HTTP API and SSE endpoints
- [WASM Plugin Development](/en/guide/v3/phira-mp-plus/plugin-dev) — Plugin development guide
- [Project Structure & Configuration](/en/guide/v3/phira-mp-plus/readme) — Project structure, terminal compatibility, config reference

## License

AGPLv3
