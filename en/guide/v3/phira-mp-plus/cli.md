# Phira-mp+ CLI Command Reference

## Startup Arguments

```
phira-mp-plus-server [OPTIONS]

  -p, --port <PORT>          Server listen port [default: 12346]
  -d, --plugins-dir <DIR>    WASM plugin directory path [default: "plugins"]
  -e, --ext-file <FILE>      Extension data persistence JSON file path [default: "data/extensions.json"]
      --no-cli               Disable interactive CLI management console
  -l, --log-file <NAME>      Log file base name [default: "phira-mp-plus"]
  -m, --monitor <IDS>...     Phira user IDs allowed to spectate (can be specified multiple times, e.g. `-m 1 -m 2`)
      --http-port <PORT>     HTTP/SSE service port [default: 12347]
  -c, --config <FILE>        YAML config file path [default: "server_config.yml"]
  -h, --help                 Show help information
  -V, --version              Show version number
```

Configuration loading order (later overrides earlier): YAML config file < Environment variables < CLI arguments.

## Interactive Management Console

The server starts a ratatui management console in regular interactive terminals and tmux. GNU Screen environment automatically switches to line-by-line compatible console, without color, alternate screen, mouse, or Bracketed Paste control sequences; redirect, systemd, and other non-TTY environments also use the line-by-line console. Set `NO_COLOR` to disable colors in other terminals.

### Command List

#### General Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `help` | `h`, `?` | Show help information |
| `exit` | `quit`, `q` | Shut down the server |
| `status` | `st` | Show server status |

#### Plugin Management (WASM)

| Command | Description |
|---------|-------------|
| `plugin list` | List all loaded WASM plugins |
| `plugin enable <name>` | Enable the specified plugin |
| `plugin disable <name>` | Disable the specified plugin |
| `plugin info <name>` | Show plugin details |
| `plugin reload` | Reload all WASM plugins |

#### User Management

| Command | Description |
|---------|-------------|
| `users` | List online users |
| `kick <user ID>` | Kick user from the server |
| `kick <room ID> <user ID>` | Kick user from a room |
| `broadcast [scope] <message>` | Broadcast a message |

##### broadcast Scopes

```
broadcast all <message>            Broadcast to all users
broadcast room <room ID> <message>  Broadcast to the specified room
broadcast user <user ID> <message>  Send to the specified user
```

#### Room Management (room subcommand)

| Command | Description |
|---------|-------------|
| `rooms` / `room list` | List active rooms |
| `room info <room ID>` | Room details (status, host, chart, history) |
| `room start <room ID>` | Force start the game |
| `room cancel <room ID>` | Cancel ready state |
| `room kick <room ID> <user ID>` | Kick user from room |
| `room transfer <room ID> <user ID>` | Transfer room host |
| `room set <room ID> <field> <value>` | Modify room settings (lock/cycle/chart-id) |
| `room close <room ID>` | Disband room |
| `room history <room ID>` | View play history |
| `room ban <room ID> <user ID>` | Add user to room blacklist |
| `room unban <room ID> <user ID>` | Remove user from room blacklist |
| `room banlist <room ID>` | Room blacklist |

Compatible old aliases: `rooms`, `room-info` / `ri`, `room-start` / `rs`, `room-cancel` / `rc`,
`room-transfer` / `rt`, `room-history` / `rh`, `close-room` / `cr`,
`room-ban` / `rb`, `room-unban` / `ru`, `room-banlist` / `rbl`

#### Ban Management

| Command | Description |
|---------|-------------|
| `ban <user ID> [reason]` | Ban user |
| `unban <user ID>` | Unban user |
| `banlist` | List banned users |

#### Extension Data

| Command | Description |
|---------|-------------|
| `ext-list` | List all registered extension data fields |
| `ext-get <ID> <key>` | Get extension data for a specified user/room |

## Web API

The central HTTP/SSE server listens on the configured `--http-port` (default 12347).

| Endpoint | Description |
|----------|-------------|
| `GET /api/rooms` | Room list (with details) |
| `GET /api/rooms/{name}` | Specified room info |
| `GET /api/user_name/{id}` | User name lookup |
| `GET /api/players/count` | Online player count |
| `GET /api/events` | Unified SSE endpoint |
| `GET /rooms/listen` | SSE room event stream (web-monitor compatible) |
| `GET /ws/live` | WebSocket real-time monitoring (web-monitor compatible) |

Detailed API documentation can be found at [api.md](/en/guide/v3/phira-mp-plus/api).

## WASM Plugin System

The server supports loading `.wasm` plugins via wasmtime. Plugins should be placed in the `plugins/` directory (can be customized with `-d`).
Plugins access all server capabilities through `phira:host/api` imported functions:

- Status queries: rooms.list, player.touches, round.data, etc.
- Message sending: send.to_user, send.to_room, send.to_all
- Room management: room.kick, room.transfer_host, room.set_lock, room.close
- User management: admin.kick_user, admin.ban_user, admin.unban_user, admin.is_banned
- Plugin interop: plugin.api_call, plugin.api_register
- Data read/write: ext.get/set, config.get/set, file.read/write
- HTTP requests: http.get/post

See `wit/phira/mpplus.wit` for the full interface definition.

## Log Files

Log files are stored in the `log/` directory, rotated hourly.

Log level is controlled via the `RUST_LOG` environment variable:

```bash
RUST_LOG=info phira-mp-plus-server
RUST_LOG=debug phira-mp-plus-server
```
