# Phira-mp+ API Documentation

## HTTP API (Port 12347)

All HTTP APIs are provided via `plugin_http` and support JSON request/response.

### Room Information

#### `GET /api/rooms`
Returns a list of all active rooms along with server statistics.

**Response:** `200 OK` JSON
```json
{
  "rooms": [
    {
      "name": "room1",
      "host": 16,
      "users": [16, 17],
      "lock": false,
      "cycle": false,
      "chart": 12345,
      "state": "SELECTING_CHART",
      "rounds": []
    }
  ],
  "player_count": 5,
  "total_players": 42
}
```

| Field | Description |
|-------|-------------|
| `rooms` | List of active rooms |
| `player_count` | Current number of online players |
| `total_players` | Total number of players who have connected to the server |

#### `GET /api/rooms/<name>`
Returns details for a specific room.

**Parameters:** `<name>` — Room name (URL path)

**Response:** `200 OK` JSON
```json
{
  "host": 16,
  "users": [16, 17],
  "lock": false,
  "cycle": false,
  "chart": 12345,
  "state": "SELECTING_CHART",
  "rounds": []
}
```

#### `GET /api/user_name/<id>`
Get the username by Phira ID.

**Parameters:** `<id>` — Phira user ID

**Response:** `200 OK`
```
Username
```

#### `GET /api/players/count`
Get the current number of online players.

**Response:** `200 OK`
```json
{"count": 5}
```

#### `GET /api/players/all`
Get a list of all player IDs that have connected to the server.

**Response:** `200 OK`
```json
{
  "total": 42,
  "players": [16, 17, 18, 19]
}
```

### SSE Events

#### `GET /api/events`

Unified event stream. Sends `ready` immediately after connection is established; room lifecycle events also flow into this stream.

#### `GET /rooms/listen`

Room event stream. The order of events upon connection establishment is as follows:

1. `ready`: Indicates the stream is established;
2. One `update_room` snapshot for each existing room;
3. Continuous delivery of subsequent room events.

Event data is consistent with the room event structure of `phira-web-monitor`:

- `create_room`: `{ "room": string, "data": RoomData }`
- `update_room`: `{ "room": string, "data": PartialRoomData | RoomData }`
- `join_room`: `{ "room": string, "user": number }`
- `leave_room`: `{ "room": string, "user": number }`
- `new_round`: `{ "room": string, "round": RoundData }`
- `stream_lagged`: Consumer is behind the broadcast buffer; `skipped` indicates the number of dropped events

Verification command:

```bash
curl -N http://127.0.0.1:12347/rooms/listen
```

Even if there are currently no rooms, you should immediately see `event: ready`, not just keep-alive comments. The response includes `Cache-Control: no-cache` and `X-Accel-Buffering: no` to avoid common reverse proxy buffering of the event stream.

### WebSocket

#### `GET /ws/live`
Real-time game data WebSocket (web-monitor compatible).

---

## CLI Commands

Enter the following commands in the TUI or stdin CLI:

### System Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `exit` / `quit` | Shut down the server |
| `benchmark [dur_s=30] [rooms=100]` | Stress test |

### Room Management

| Command | Description |
|---------|-------------|
| `rooms` / `r` | List all rooms |
| `room info <id>` / `room i <id>` | View room details |
| `room kick <id> <user_id>` | Kick a user |
| `room close <id>` | Close a room |
| `room transfer <id> <user_id>` | Transfer room host |
| `room set <id> <field> <value>` | Modify room settings (lock/cycle, etc.) |
| `room history <id>` | Room play history (replaces deprecated round-last) |
| `room uuid <id>` | Room UUID |
| `room ban <id> <user_id>` | Ban a user from room |
| `room unban <id> <user_id>` | Unban a user from room |
| `room banlist <id>` | Room blacklist |

### Player Management

| Command | Description |
|---------|-------------|
| `users` / `u` | List all online players |
| `user-rooms <user_id>` / `rh <user_id>` | Player's room visit history |
| `ban <user_id> [reason]` | Ban a user |
| `unban <user_id>` | Unban a user |
| `kick <user_id>` | Kick a user |
| `pardon <user_id>` | Pardon/unban |

### Play Statistics

| Command | Description |
|---------|-------------|
| `playtime <user_id>` | Query user playtime |
| `player-count` | Total number of players who have played |
| `room history <room_id>` | View room play records (replaces deprecated round-last) |

### Welcome Messages

| Command | Description |
|---------|-------------|
| `welcome-config` | View welcome message configuration and placeholders |

### Placeholders (Welcome Message Templates)

| Placeholder | Description |
|-------------|-------------|
| `[user_name]` | Username |
| `[user_id]` | Phira ID |
| `[player-count]` | Current online count |
| `[players]` | Same as above |
| `[time]` | Unix timestamp |
| `[playtime]` | This user's playtime |
| `[playtime <id>]` | Specified user's playtime |
| `[top_playtime]` | Playtime leaderboard (top 10) |
| `[active_rooms]` | Active room details |

---

## TCP Binary Protocol (Port 12346)

Binary protocol for communicating with the Phira game client. Uses a custom binary format (`BinaryData` derive), see `phira-mp-common` for details.

### Connection Flow

1. Client sends version byte (1)
2. Client sends `Authenticate { token: Varchar<32> }`
3. Server replies with `Authenticate(Ok((UserInfo, Option<ClientRoomState>)))`
4. Heartbeat: Client sends `Ping` every 3 seconds, server replies with `Pong`

### Client Commands

| Command | Description |
|---------|-------------|
| `Ping` | Heartbeat |
| `Authenticate { token }` | Authentication |
| `Chat { message }` | Send chat message |
| `Touches { frames }` | Touch data |
| `Judges { judges }` | Judgment data |
| `CreateRoom { id }` | Create a room |
| `JoinRoom { id, monitor }` | Join a room |
| `LeaveRoom` | Leave a room |
| `LockRoom { lock }` | Lock/unlock a room |
| `CycleRoom { cycle }` | Cycle mode |
| `SelectChart { id }` | Select a chart |
| `RequestStart` | Request to start |
| `Ready` | Ready up |
| `CancelReady` | Cancel ready |
| `Played { id }` | Finished playing |
| `Abort` | Abort |
| `QueryRoomInfo` | Query room list |

### Server Commands

| Command | Description |
|---------|-------------|
| `Pong` | Heartbeat reply |
| `Authenticate(...)` | Authentication result |
| `Chat(...)` | Chat result |
| `Touches { player, frames }` | Player touch data |
| `Judges { player, judges }` | Player judgment data |
| `Message(...)` | Room message |
| `ChangeState(...)` | Room state change |
| `ChangeHost(...)` | Host change |
| `RoomResponse(...)` | Room list (QueryRoomInfo reply) |
| `RoomEvent(...)` | Room event (for room monitor) |
| `UserVisit(...)` | User visit notification (for room monitor) |

### Room Monitor Protocol

Room monitors connect via `RoomMonitorAuthenticate { key }` and can receive:
- `RoomEvent`: Room create/update/join/leave/new round
- `UserVisit`: User visit notification
- Get room list via `QueryRoomInfo`

---

## Configuration File (`server_config.yml`)

```yaml
# Network
port: 12346                    # TCP listening port
http_port: 12347               # HTTP/SSE port

# Authentication
monitors: [2]                  # Allowed Phira user IDs for spectating
phira_api_endpoint: "https://phira.5wyxi.com"

# Plugins
plugins_dir: plugins

# Features
chat_enabled: true
cli_enabled: true

# Limits
connection_rate_limit: 30      # Connection rate limit
connection_rate_window: 10     # Statistics window (seconds)
round_data_retention_days: 7   # Round data retention days

# Database
# database_url: "postgres://user:pass@localhost:5432/phira_mp_plus"
```

---

## Internal Routes (`server_state_query`)

These are server-side query methods called internally via `PlusServerState`, used by the Web API and CLI.

| Method | Description |
|--------|-------------|
| `player.touches` | Query player touch data |
| `player.judges` | Query player judgment data |
| `round.data` | Round data |
| `round.list` | Round list |
| `room.uuid` | Room UUID |
| `room.history` | Room history |
| `room.round_info` | Round details |
| `room.list_since` | Rooms since a specified time |
| `room.kick` | Kick a player |
| `room.transfer_host` | Transfer host |
| `room.set_lock` | Set lock |
| `room.close` | Close room |
| `admin.kick_user` | Admin kick user |
| `admin.ban_user` | Ban user |
| `admin.unban_user` | Unban user |
| `admin.is_banned` | Check ban status |
| `admin.ban_list` | Ban list |
| `admin.list_users` | User list |
| `user.room_history` | User room history |
| `rooms.list` | Room list |
| `rooms.by_name` | Find room by name |
| `rooms.by_user` | Find room by user |
| `user_name` | Username query |
| `test.run_benchmark` | Benchmark test |
| `test.cleanup` | Clean up test data |
