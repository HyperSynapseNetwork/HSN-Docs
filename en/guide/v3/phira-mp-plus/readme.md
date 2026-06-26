# Phira-mp + Project Overview

## Project Structure

```
Phira-mp-plus/
│
├── Cargo.toml                   # Workspace root
├── Cargo.lock
├── LICENSE                      # AGPL-3.0
├── README.md
│
├── server_config.yml            # YAML config file (auto-generates default template on first run)
├── data/                        # Runtime data directory
│   ├── extensions.json          #   Plugin extension data persistence
│   ├── rounds/                  #   Round Touches/Judges records
│   └── plugins/                 #   Plugin private data
├── log/                         # Runtime logs (hourly rotation)
│
├── phira-mp-plus-server/        # Server core
│   ├── Cargo.toml               #   Dependencies: axum / tokio / wasmtime / clap etc.
│   ├── locales/                 #   Fluent i18n translation files
│   │   ├── en-US.ftl
│   │   ├── zh-CN.ftl
│   │   └── zh-TW.ftl
│   └── src/
│       ├── main.rs              #   Process entry and lifecycle
│       ├── logging.rs           #   Tracing output and log rotation
│       ├── terminal.rs          #   Terminal capability detection and Screen fallback strategy
│       ├── lib.rs               #   Module exports
│       ├── server.rs            #   Server core: PlusConfig / PlusServerState / PlusServer
│       │                        #     Accept loop, benchmark methods, state query dispatch
│       ├── session.rs           #   Session management: Session / User models, auth, command processing
│       │                        #     Touches/Judges data flow to plugin events + disk storage
│       ├── room.rs              #   Room state machine: InternalRoomState / Room
│       │                        #     Select→Ready→Play→Settlement, player real-time data cache
│       ├── plugin.rs            #   Plugin manager + WASM host: PluginManager / PluginHost trait
│       │                        #     Plugin loading, event dispatch, CLI/HTTP/API registration
│       ├── plugin_http.rs       #   HTTP service assembly and dynamic request dispatch
│       ├── plugin_http/
│       │   ├── router.rs        #   Dynamic route matching
│       │   ├── sse.rs           #   SSE event bus, snapshots and stream conversion
│       │   └── websocket.rs     #   Real-time WebSocket bridge
│       ├── wasm_host.rs         #   WASM runtime: wasmtime instance, JSON ABI, host/api bridge
│       ├── extensions.rs        #   Extension data system: user/room KV store + auth cache persistence
│       ├── ban.rs               #   Ban system: global bans + room blacklists
│       ├── round_store.rs       #   Round data storage: JSONL format, organized by round_uuid/player_id
│       ├── rate_limiter.rs      #   Rate limiting: sliding window (connections) + token bucket (commands)
│       ├── cli.rs               #   CLI command handler: 30+ management commands, plugin extension commands
│       ├── cli_tui.rs           #   TUI terminal interface: ratatui + crossterm
│       └── l10n.rs              #   Localization: Fluent Bundle / tl! macro
│
├── phira-mp-plus-server-api/    # WASM plugin shared types crate
│   └── src/lib.rs               #   PluginEvent / PluginInfo / HttpHandle
│                                #   ServerStateQuery / PluginApiHandler
│
├── phira-mp/                    # Upstream phira-mp submodule (protocol layer and original server)
│   ├── phira-mp-common/         #   Network protocol: binary encoding (BinaryData trait),
│   │   └── src/                 #     Command definitions (ClientCommand / ServerCommand),
│   │       ├── lib.rs           #     Stream frame protocol, RoomId / RoomState / message types
│   │       ├── command.rs
│   │       ├── bin.rs           #     BinaryReader / BinaryWriter (LEB128, little-endian)
│   │       └── framing.rs       #     Packet/Unpacket (VARINT length prefix)
│   ├── phira-mp-macros/         #   #[derive(BinaryData)] procedural macro
│   ├── phira-mp-server/         #   Original standalone server (reference)
│   └── phira-mp-client/         #   TCP client library (for game integration)
│
├── docs/                        # Local documentation
│   ├── cli.md                   #   CLI command reference
│   └── plugin-dev.md            #   WASM plugin development guide + WIT API reference
│
└── server_config.yml            # YAML config file (runtime copy)
```

## Terminal Compatibility

On startup, the server detects stdin/stdout, `TERM`, `STY`, and `TMUX`. GNU Screen automatically switches to line-by-line compatible console, without colors, alternate screen, mouse capture, or Bracketed Paste; tmux can still use the full TUI. The project also follows `NO_COLOR`, and line-by-line output filters any remaining control sequences. Non-interactive environments also use the line-by-line console.

## SSE Room Events

After connecting to `GET /rooms/listen`, the server first sends `ready`, then replays current room snapshots as `update_room` events, followed by continuous `create_room`, `update_room`, `join_room`, `leave_room`, and `new_round` events. Use the following command to inspect the data stream:

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

## Build Features

| Feature | Description | Default |
|---------|-------------|---------|
| `plugin-system` | WASM plugin support (wasmtime) | Yes |

## Configuration Reference

See `server_config.yml` for the full configuration:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `port` | u16 | `12346` | TCP listen port |
| `http_port` | u16 | `12347` | HTTP/SSE service port |
| `monitors` | Vec\<i32\> | `[2]` | Phira user IDs allowed to spectate |
| `phira_api_endpoint` | String | `https://phira.5wyxi.com` | Phira API endpoint |
| `plugins_dir` | String | `plugins` | Plugin directory |
| `chat_enabled` | bool | `true` | Chat feature toggle |
| `cli_enabled` | bool | `true` | CLI console toggle |
| `connection_rate_limit` | u32 | `30` | Connection rate limit (allowed count per window) |
| `connection_rate_window` | u32 | `10` | Connection rate stats window (seconds) |
| `max_users_per_room` | usize | `8` | Max players per room |
| `round_data_retention_days` | u32 | `7` | Round Touches/Judges retention days (0=no retention) |
| `server_name` | String | — | Server name |
