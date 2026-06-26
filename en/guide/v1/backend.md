# HSNPhira v1 Backend

HSNPhira v1 Backend uses the Python Flask framework, composed of multiple independent microservices, providing user management, room monitoring, command execution, and file services.

## Service Architecture Overview

| Service | Port | Tech Stack | Description |
|------|------|--------|------|
| user_manager | 2345 | Flask + SQLite | User registration/login/info management, Phira data sync |
| room | 5000 | Flask + Log Parsing | Real-time room status monitoring (log-driven) |
| api | 5001 | Flask + SQLite | Room data collection and statistical analysis (API-driven) |
| command | 7878 | Flask | Secure command execution (whitelist + password verification) |
| file | 7880 | Flask | File content service |

---

## 1. user_manager (Port 2345)

Core user account management service.

### Features

- **User Registration** (`POST /register`) — Bind Phira account for registration, password salted hash storage
- **User Login** (`POST /login`) — Password verification, returns user info
- **User Info Query** (`POST /info`) — Queryable by admin/super admin privileges
- **User Info Modification** (`POST /info_changer`) — Modify username, password, Phira ID, permissions, etc.
- **Admin Interfaces** — User list query, single user update, batch update
- **Phira Data Sync** — Background thread periodically updates user avatar and RKS from `phira.5wyxi.com` API

### Database

- **File**: `phira_users.db` (SQLite)
- **Table `users`**: id, name, phira_id, phira_name, phira_rks, image_url, password(hash), admin, dev, created_at

### Authentication

| Role | Credential | Permissions |
|------|------|------|
| Super Admin | Fixed password (configured in code) | Full control, can modify password/permission fields |
| Regular Admin | Fixed password (configured in code) | Query user info, modify non-permission fields |

---

## 2. room (Port 5000)

Log-driven real-time room status monitoring service. Tracks room events by reading `phira-mp/server.log` in real-time.

### Features

- **Log Monitoring** — Real-time log file tracking, parsing room create/join/leave/disband events
- **Room State Tracking** — Records room state (selecting chart/in-progress), cycle toggle, chart selection
- **User Mapping** — Maintains user_id → username and user_id → room_name mappings
- **Persistence** — User mapping relationships written to `user_info.json`

### API

| Endpoint | Description |
|------|------|
| `GET /rooms` | Get detailed info for all rooms |
| `GET /status` | System status (room count, user count) |
| `GET /health` | Health check |
| `GET /users/total` | Total registered user count |

### Background Threads

- **Log Tracking** (tail_log) — Reads log file changes in real-time
- **Room Cleanup** (room_cleanup_task) — Cleans up rooms inactive for over 1 hour every 60 seconds

---

## 3. api (Port 5001)

API-driven room data collection and statistics service. Polls `phira.htadiy.cc/api/rooms/info` for data.

### Features

- **Room Monitoring** — Pulls room list from Phira API every second and stores in database
- **User Entry/Exit Tracking** — Records when users enter/leave rooms and their stay duration
- **Game Round Tracking** — Records game start/end times, user play duration
- **Online User Count Statistics**

### Database

- **File**: `phira_stats.db` (SQLite)
- **Tables**: rooms, user_room_activity, user_room_duration, game_rounds, user_playtime

| Endpoint | Description |
|------|------|
| `GET /users` | Current total online users |

### Background Threads

- **Room Monitoring** (room_monitor_service) — Polls API every second, updates database

---

## 4. command (Port 7878)

Secure remote command execution service.

### Features

- **Whitelist Commands** — Predefined controlled commands (start/restart/stop/serverinfo)
- **Custom Commands** — Allows execution of arbitrary commands (configurable via settings)
- **Triple Password Verification** — Requires three password fragments for authentication
- **Dangerous Command Blacklist** — Blocks dangerous operations like rm -rf /, mkfs, shutdown, etc.

### API

| Endpoint | Description |
|------|------|
| `POST /execute` | Execute command (whitelist or custom) |

### Security Mechanisms

- All commands safely parsed via `shlex.split`
- Dangerous command blacklist interception
- Passwords verified using `werkzeug.security.check_password_hash`

---

## 5. file (Port 7880)

Simple file content service.

### Features

- Reads and returns file content at specified path (default `/root/user_info.json`)
- Supports configuring target file via environment variable `FILE_PATH`

### API

| Endpoint | Description |
|------|------|
| `GET /api` | Returns file content |

---

## Startup Methods

```bash
# User management service
python user_manager.py       # → :2345

# Room monitoring service (log-driven)
python room.py               # → :5000

# Room monitoring service (API-driven)
python api.py                # → :5001

# Command execution service
python command.py            # → :7878

# File service
python file.py               # → :7880
```

## Dependencies

- `flask` — Web framework
- `werkzeug.security` — Password hashing
- `sqlite3` — Database (Python built-in)
- `requests` — HTTP requests (room API collection)
- `threading` — Background threads (Python built-in)