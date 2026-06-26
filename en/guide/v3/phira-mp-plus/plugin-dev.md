# Phira-mp+ Plugin Development Documentation

Phira-mp+ supports **WASM plugins** — compiled to WebAssembly and dynamically loaded via wasmtime.

> The built-in plugin system (NativePlugin trait) has been merged into the server core code, and independent native plugin registration is no longer supported.
> For external extensions, please use WASM plugins.

## WASM Plugins

WASM plugins are dynamically loaded via the wasmtime runtime and deployed in the `plugins/` directory (can be customized with the `-d` parameter).

### JSON ABI

WASM plugins communicate with the host via JSON strings:

**Exported Functions:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `phira_init` | `() -> i32` | Initialize the plugin, returns 0 for success |
| `phira_get_info` | `() -> ()` | Write plugin metadata to memory offset 0 |
| `phira_cleanup` | `() -> ()` | Clean up when plugin is unloaded |
| `phira_on_event` | `(ptr: i32, len: i32) -> i32` | Event handler, returns 0=handled 1=not handled |
| `phira_alloc` | `(size: i32) -> i32` | Allocate linear memory, returns pointer |
| `phira_dealloc` | `(ptr: i32, size: i32)` | Free memory |

**Imported Functions (provided by host):**

| Function | Description |
|----------|-------------|
| `phira:host/log(level_ptr, level_len, msg_ptr, msg_len)` | Log a message |
| `phira:host/uuid(out_ptr, out_len)` | Generate UUID v4 |
| `phira:host/time() -> i64` | Get Unix timestamp (milliseconds) |
| `phira:host/api(method_ptr, method_len, args_ptr, args_len, out_ptr, out_len) -> i32` | General API bridge |

### General API (`phira:host/api`)

All methods are called with JSON parameters and return JSON results. Return codes: 0=success, non-zero=error.

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `state.query` | `{ method, params }` | Query result | Unified state query entry point |
| `player.touches` | `{ user_id }` | Recent touch data | Query user's recent touch frames |
| `player.judges` | `{ user_id }` | Recent judgment data | Query user's recent judgment events |
| `round.data` | `{ round_uuid, player_id }` | Full Touches/Judges | Round data query |
| `round.list` | `{}` | Round list | All recorded rounds |
| `send.to_user` | `{ user_id, message }` | `"ok"` | Send a message to a specific user |
| `send.to_room` | `{ room_id, message }` | `"ok"` | Broadcast a message to a room |
| `send.to_all` | `{ message }` | `"ok"` | Broadcast to all users |
| `ext.get_user` | `{ user_id, key }` | Field value | Get user extension data |
| `ext.set_user` | `{ user_id, key, value }` | `"ok"` | Set user extension data |
| `ext.get_room` | `{ room_id, key }` | Field value | Get room extension data |
| `ext.set_room` | `{ room_id, key, value }` | `"ok"` | Set room extension data |
| `room.kick` | `{ room_id, target_id }` | `{"ok": true}` | Kick a user from a room |
| `room.transfer_host` | `{ room_id, target_id }` | `{"ok": true}` | Transfer room host |
| `room.set_lock` | `{ room_id, locked }` | `{"ok": true}` | Lock/unlock a room |
| `room.close` | `{ room_id }` | `{"ok": true}` | Disband a room |
| `admin.kick_user` | `{ user_id, reason }` | `{"ok": true}` | Kick a user from the server |
| `admin.ban_user` | `{ user_id, reason }` | `{"ok": true}` | Ban a user |
| `admin.unban_user` | `{ user_id }` | `{"ok": true}` | Unban a user |
| `admin.is_banned` | `{ user_id }` | `{"banned": bool}` | Check ban status |
| `admin.ban_list` | `{}` | Ban list | Get all bans |
| `admin.list_users` | `{}` | User list | List all online users |
| `plugin.api_call` | `{ plugin, method, args }` | Call result | Call an API registered by another plugin |
| `plugin.api_register` | `{ method }` | Registration confirmation | Register this plugin's API for other plugins to call |
| `config.get` | `{ key }` | Config value | Get plugin configuration |
| `config.set` | `{ key, value }` | `"ok"` | Set plugin configuration |
| `http.get` | `{ url }` | Response body | HTTP GET request |
| `http.post` | `{ url, body, content_type }` | Response body | HTTP POST request |
| `file.read` | `{ path }` | File content | Read a plugin data file |
| `file.write` | `{ path, content }` | `"ok"` | Write a plugin data file |
| `uuid.v4` | `{}` | UUID string | Generate a UUID |
| `time.now` | `{}` | Unix timestamp | Get the current time |

Full WIT definitions can be found in `wit/phira/mpplus.wit`.

### Plugin Events

WASM plugins receive events via `phira_on_event`, with events passed in JSON format. The `type` field identifies the event type:

| type | Data Fields | Trigger Condition |
|------|------------|------------------|
| `user_connect` | user_id, user_name, user_ip | After user authentication succeeds |
| `user_disconnect` | user_id, user_name | User disconnects |
| `room_create` | user_id, room_id | Room created |
| `room_join` | user_id, room_id, is_monitor | Joined a room |
| `room_leave` | user_id, room_id | Left a room |
| `room_modify` | user_id, room_id, data | Room settings modified |
| `game_start` | user_id, room_id | Game started |
| `game_end` | user_id, user_name, room_id, score, accuracy, perfect, good, bad, miss, max_combo, full_combo | Player submitted score |
| `player_touches` | user_id, room_id, data | Player touch event |
| `player_judges` | user_id, room_id, data | Player judgment event |
| `round_complete` | room_id, chart_id, chart_name | A round of the game completed |

Example — listening for user connection events:

```javascript
// In phira_on_event:
function phira_on_event(event_ptr, event_len) {
  let json = memory_to_string(event_ptr, event_len);
  let event = JSON.parse(json);
  if (event.type === 'user_connect') {
    console.log(`User ${event.user_name}(${event.user_id}) connected from ${event.user_ip}`);
  }
  return 0; // 0 = handled
}
```

### Plugin Metadata

WASM plugins can declare metadata in two ways:

1. **Export `phira_get_info`** — The plugin writes JSON metadata to linear memory itself
2. **Memory offset 0** — Place a length-prefixed JSON at offset 0 of the WASM module (compatibility mode)

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "author": "me",
  "description": "My WASM plugin"
}
```

## Inter-Plugin API Calls

WASM plugins can call APIs registered by other plugins via `plugin.api_call`:

```javascript
// Call the count method of the playtime-tracker plugin
let result = api.call('plugin.api_call', {
  plugin: 'player-tracker',
  method: 'count',
  args: []
});
// result = {"count": 42}
```

Register your own API via `plugin.api_register`:

```javascript
api.call('plugin.api_register', {
  method: 'my_custom_api'
});
```

> Note: Full bidirectional WASM callbacks are currently stubs; registered APIs can be called but return fixed responses.
> Natively registered Rust APIs (via PluginManager::register_plugin_api) can be called normally by WASM plugins.

## Real-time Data Streams

Touches/Judges data is pushed to the WASM plugin's `phira_on_event` handler via `player_touches` and `player_judges` events, with no need for active polling.

## Building WASM Plugins

WASM plugins must be compiled for the `wasm32-unknown-unknown` target:

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

Place the generated `.wasm` file in the server's `plugins/` directory. It will be loaded on the next startup or when `plugin reload` is executed.

## Server Configuration

WASM plugins can read/write their own configuration via the `config.get` / `config.set` API (in-memory, lost on restart).
For persistent configuration, it is recommended to use `file.read` / `file.write` operations on the `data/plugins/<plugin_name>/` directory.

## WIT Interface Definitions

Complete WIT interface definitions can be found in `wit/phira/mpplus.wit`, including the following interfaces:

- `user-events` — User event listening
- `user-info` — User info querying
- `room-info` — Room info querying
- `messaging` — Message sending
- `room-management` — Room management
- `user-management` — User management
- `utilities` — Utility functions
- `database` — Database interface (reserved)
- `plugin-config` — Plugin configuration
- `plugin` — Plugin main entry
- `cli` — CLI command interface
