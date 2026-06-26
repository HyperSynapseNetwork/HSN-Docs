# cpp-phira-mp

A C++ version of phira-mp rebuilt from [phira-mp](https://github.com/TeamFlos/phira-mp), with new features including Web admin panel, REST API, SSE real-time events, ban system, spectator system adaptation, and connection welcome messages.

## Features

### 1. Web Admin Panel (Password Protected)
- Access via browser at `http://server-ip:12347/admin` (by default)
- **Login Authentication**: Default password is `admin` on first run, please change it immediately
- View all room lists, room status, player counts and lists
- Real-time refresh (auto-updates every 5 seconds)
- One-click disband any room
- One-click kick any player from a room
- Ban/unban player IDs (banned players see "You have been banned" on connection)
- Ban list persists in `banned_users.json`

### 2. API

| Endpoint | Description |
|----------|-------------|
| `GET /api/rooms/info` | Get all room lists and full data |
| `GET /api/rooms/info/<n>` | Get info for a room by name |
| `GET /api/rooms/user/<user_id>` | Get room info for a specific user |
| `GET /api/rooms/listen` | SSE real-time event stream |

#### SSE Event Types
| Event | Description |
|-------|-------------|
| `keepalive` | Keep connection alive |
| `create_room` | New room created |
| `update_room` | Room data updated (state, chart, lock, cycle, etc.) |
| `join_room` | User joined a room |
| `leave_room` | User left a room |
| `player_score` | Player finished a game (includes full score record) |
| `start_round` | Room started a new round |

SSE connections have a built-in 15-second keepalive mechanism to prevent disconnection by middleware or firewalls.

### 3. This program can be used with the [Phira Spectator Implementation](https://github.com/HyperSynapseNetwork/phira-web-monitor) for spectating.

### 4. Connection Welcome Messages
- Automatically sends a welcome message after user authentication succeeds
- Displays the current list of joinable rooms (only shows rooms that are selecting charts and unlocked)

---

## Pre-build Setup

```bash
# Update package list
sudo apt update

# Install build tools and dependencies
sudo apt install -y build-essential g++ curl pkg-config uuid-dev libsqlite3-dev zlib1g-dev libssl-dev libboost-dev libspdlog-dev libargon2-dev libfmt-dev nlohmann-json3-dev libcurl4-openssl-dev make
```

### Required Dependencies
| Dependency | Ubuntu Package | Purpose |
|------------|----------------|---------|
| G++ (>=10) | `build-essential` / `g++` | C++20 compiler |
| uuid-dev | `uuid-dev` | UUID generation |
| curl | `curl` | HTTP requests (fetch Phira API data) |
| make | `build-essential` | Build tool |
| pkg-config | `pkg-config` | Build tool |
| Boost | `libboost-dev` | Required dependency |
| spdlog | `libspdlog-dev` | Logging level implementation |
| Argon2 | `libargon2-dev` | Binary protocol |
| Json3 | `nlohmann-json3-dev` | JSON handling |
| SQLite3 | `libsqlite3-dev` | User ID database implementation |
| Curl-OpenSSL | `libcurl4-openssl-dev` | Curl and OpenSSL implementation |
| OpenSSL | `libssl-dev` | SSL support |

---

## Build

```bash
cd cpp-phira-mp
make clean
make -j$(nproc)
```

A successful build generates the `phira-mp-server` executable.

---

## Download

You can visit the project's [GitHub Actions](https://github.com/HyperSynapseNetwork/cpp-phira-mp/actions) to download pre-compiled executables and startup scripts. (Run with `./start.sh`).

---

## Running

```bash
# Run with default ports (game port: 12346, Web/api port: 12347, admin password: admin)
./phira-mp-server

# Custom ports
./phira-mp-server --port 12346 --http-port 12347 --admin-password PASSWORD

```

### Command Line Arguments
| Argument | Description | Default |
|----------|-------------|---------|
| `--port` | Game server port | 12346 |
| `--http-port` | Web admin/API port | 12347 |
| `--admin-password` | Admin panel password | admin |
| `--db-path` | Set database `.db` file path | visitors.db |
| `-h, --help` | Show help | - |

---

## File Structure

```
cpp-phira-mp-main/
├── include/
│   ├── binary.hpp          # Binary protocol
│   ├── command.hpp         # Command definitions
│   ├── http_server.hpp     # HTTP server
│   ├── l10n.hpp            # Localization
│   ├── room.hpp            # Room + round history
│   ├── server.hpp          # Server + get_state()
│   ├── session.hpp         # Session
│   ├── stream.hpp          # Touch info stream
│   ├── visitor_db.hpp      # Visitor count recording
├── src/
│   ├── binary.cpp          # Binary protocol implementation
│   ├── command.cpp         # Command implementation
│   ├── http_server.cpp     # Web page/API implementation
│   ├── l10n.cpp            # Localization implementation
│   ├── main.cpp            # Main entry point
│   ├── room.cpp            # Core logic implementation
│   ├── server.cpp          # Server
│   ├── session.cpp         # Core logic implementation
│   ├── visitor_db.cpp      # Visitor count recording
│   └── stream.cpp          # Spectator protocol
│   
├── locales/
│   ├── en-US.ftl
│   ├── zh-CN.ftl
│   └── zh-TW.ftl
├── Makefile
├── CMakeLists.txt
└── README.md
```

### Runtime Files
- `banned_user.json` — Banned player ID list (auto-created/managed)

---

## API Usage Examples

```bash
# Get all rooms
curl http://localhost:12345/api/rooms/info

# Get a specific room
curl http://localhost:12345/api/rooms/info/my-room

# Get the room a user is in
curl http://localhost:12345/api/rooms/user/12345

# Listen to real-time events (SSE)
curl http://localhost:12345/api/rooms/listen

```

---

## QQ Group

**1049578201**

## License

Licensed under the **MIT** license.
