# HSN Phira Web Monitor

This is a complete Web-based toolchain designed for Phira, providing real-time multiplayer spectating, user synchronization, and room query functionality.

This project primarily serves as a proxy and Web visualization layer for Phira multiplayer game rooms, allowing users to watch real-time rendered charts directly in their browser.

## Architecture Overview

This project consists of 4 main workspaces that work together:

1. **`monitor-common`**: Defines shared Rust data structures, binary parsing tools, and core logic used across the networking layer and WebGL renderer.
2. **`monitor-proxy`**: A Rust Axum-based server that acts as a bridge between the official Phira server and browser clients. It handles user authentication (JWT), polls room lists, streams remote judgment events (SSE), and serves chart binaries.
3. **`monitor-client`**: The WebAssembly (WASM) core of this project. Written in Rust, it decodes `bincode` chart data and uses WebGL to natively compute and render Phira charts.
4. **`web`**: A modern Vue 3 + TypeScript frontend application. It manages UI state, establishes WebSocket and SSE event listeners, coordinates the AudioContext, and dynamically manages canvas dimensions for the WASM WebGL engine.

---

## Component Details & API Reference

### `monitor-proxy`

The proxy server serves as the main backend of the application.

#### Data Format Definitions

All interface interactions use the following TypeScript interface definitions as a base:

```typescript
// === Authentication & User Info (Auth) ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  phira_avatar: string | null;
  phira_id: number;
  phira_rks: number;
  phira_username: string;
  register_time: string; // ISO 8601 formatted time string
  last_login_time: string; // ISO 8601 formatted time string
}

// === Room Info & List (Rooms) ===

export interface RoomListResponse {
  total: number; // Total number of rooms
  rooms: RoomInfoResponse[]; // List of room details
}

export interface RoomInfoResponse {
  name: string; // Room ID identifier
  data: RoomData;
}

export interface RoomData {
  host: number; // Host ID (-1 means no host)
  users: number[]; // List of user IDs in the room
  lock: boolean; // Whether locked
  cycle: boolean; // Whether cycle host mode
  chart: number | null; // Selected chart ID (null means not selected)
  state: "SELECTING_CHART" | "WAITING_FOR_READY" | "PLAYING"; // Room state
  rounds: RoundData[]; // List of historical rounds in the room
}

export interface RoundData {
  chart: number; // Chart ID for this round (-1 means none)
  records: RecordData[]; // List of player scores for this round
}

export interface RecordData {
  id: number;
  player: number;
  score: number;
  perfect: number;
  good: number;
  bad: number;
  miss: number;
  max_combo: number;
  accuracy: number; // e.g., 1.0 represents 100%
  full_combo: boolean;
  std: number;
  std_score: number;
}

// === Visited Users (Visited Users) ===

export interface VisitedUserListResponse {
  count: number; // Total number of visited users
  users?: VisitedUserInfo[]; // List of users (only returned when count_only is false)
}

export interface VisitedUserInfo {
  phira_id: number;
}
```

Event definitions for SSE (`GET /rooms/listen`):

```typescript
// === SSE Room Listen Events (SSE) ===

// Room creation event
export interface SSEEventCreateRoom {
  room: string;
  data: RoomData;
}

// Room state update event
export interface SSEEventUpdateRoom {
  room: string;
  data: Partial<RoomData>; // Data update (if absent, the frontend can interpret as room creation)
}

// Player joins or leaves room event
export interface SSEEventJoinOrLeaveRoom {
  room: string;
  user: number;
}

// Contains a new round settlement
export interface SSEEventNewRound {
  room: string;
  round: RoundData;
}
```

#### `GET /chart/{id}`

**Description**: Get the binary data for the chart with the specified `id`, used by `monitor-client` for decoding.

**Response Format**: `application/octet-stream`.

#### `GET /rooms/info`

**Description**: Get a list of all currently active rooms.

**Response Format**: `application/json`, formatted as `RoomListResponse`.

#### `GET /rooms/info/{id}`

**Description**: Get detailed info for the room with the specified `id`.

**Response Format**: `application/json`, formatted as `RoomInfoResponse`.

#### `GET /rooms/user/{id}`

**Description**: Query the room where the specified user (ID) is currently located.

**Response Format**: `application/json`, formatted as `RoomInfoResponse` (or `null` if not in any room).

#### `GET /visited`

**Description**: Get info about users who have created or joined rooms on this server.

**Query Parameters**:
- `count_only`: (optional, boolean) Whether to return only the total count. Default is `false`.

**Response Format**: `application/json`, formatted as `VisitedUserListResponse`.

#### `GET /rooms/listen`

**Description**: A Server-Sent Events (SSE) stream for listening to room lifecycle events.

**Response Format**: `text/event-stream`.

Event types included:

- `create_room`: Sends JSON data structured as `SSEEventCreateRoom`. When an SSE connection is established, the server immediately sends several `create_room` events representing the current state of all rooms.
- `update_room`: Sends JSON data structured as `SSEEventUpdateRoom`.
- `join_room`: Sends JSON data structured as `SSEEventJoinOrLeaveRoom`.
- `leave_room`: Sends JSON data structured as `SSEEventJoinOrLeaveRoom`.
- `new_round`: Sends JSON data structured as `SSEEventNewRound`.

#### `POST /auth/login`

**Description**: Login endpoint proxied to the official Phira authentication interface. Returns a JWT Token on success, which the frontend needs to save for subsequent authenticated requests.

**Request Format**: `application/json`, formatted as `LoginRequest`.

**Response Format**: `application/json`, formatted as `LoginResponse`.

#### `GET /auth/me`

**Description**: Get the user profile data corresponding to the current JWT Token (cached from Phira native data). Requires the `Authorization: Bearer <token>` header.

**Response Format**: `application/json`, formatted as `ProfileResponse`.

---

## Development Guide

To develop this project locally, make sure **Rust**, **Node.js (v18+)**, and **wasm-pack** are installed.

1. **Build the WASM client:**

```bash
cd monitor-client
wasm-pack build --out-dir ../web/pkg --target web
```

2. **Run the frontend (Vue):**

```bash
cd web
npm install
npm run dev
```

3. **Run the proxy backend:**

_(Note: Set up a local development secret key first)_

```bash
export HSN_SECRET_KEY=dev_secret_local
cargo run --bin monitor-proxy -- --debug
```

---

## Production Deployment Guide

Deploying HSN Phira Proxy requires compiling static WebAssembly/Vue artifacts and ensuring the Rust server runs securely.

### Prerequisites

- Build tools: `rustc`, `cargo`, `npm`, `wasm-pack`.
- Web server (e.g., Nginx or Caddy) for hosting static pages and reverse proxying.

### 1. Build the WASM Engine

**This step must be done first**, as the Vue build depends on the WASM module output to the `pkg/` folder.

```bash
cd monitor-client
wasm-pack build --target web --out-dir ../web/pkg --release
```

### 2. Build the Static Web Frontend

Compile the Vue 3 application into standard HTML/JS static files.

#### Environment Variable Configuration (.env)

Configure frontend environment variables in the `web` directory. For production, create or modify the `.env.production` file before building:
If you are deploying the frontend and backend separately (the API backend is not on the same domain as the web page hosting), you need to specify the API root URL that the frontend uses to access the proxy backend:

```env
# Example: External access URL for the proxy backend
VITE_API_BASE=https://api.yourdomain.com
```

_Note: If not configured or set to an empty string `""`, the frontend will send requests to the same-origin relative path as the current page (which is ideal when using Nginx for unified reverse proxying)._

```bash
cd web
npm ci
npm run build
```

The optimized frontend files will be output to `web/dist`.

### 3. Build and Run the API Proxy Backend

Compile the Rust binary natively in release mode for maximum performance.

```bash
cargo build --release --bin monitor-proxy
```

#### Startup Options Guide

`monitor-proxy` supports the following command-line arguments, viewable with `--help`:

- `--debug`: Enable debug mode. When enabled, CORS security policies are relaxed.
- `--port <PORT>`: The port the server listens on (default is `3080`).
- `--cache-dir <DIR>`: The cache download directory for charts on disk (default is `~/.cache/hsn-phira`).
- `--api-base <URL>`: The fetch URL pointing to the official Phira API (default is `https://phira.5wyxi.com`).
- `--mp-server <ADDR>`: The Phira multiplayer game server address for fetching room info (default is `localhost:12346`).
- `--allowed-origin <ORIGIN>`: **Required in production**. Set an explicit Cross-Origin Resource Sharing (CORS) allowed origin domain (e.g., `https://monitor.example.com`). Without this setting, the program cannot start (unless `--debug` is enabled).

#### Environment Variables

The Rust server also needs a Secret Key to ensure encryption security when generating user tokens, and for authentication when communicating with the phira-mp server. This **must** be defined before starting the process, **and must match the one set in phira-mp**.

```bash
export HSN_SECRET_KEY=$(openssl rand -hex 32)
```

Start the server (recommend using a process manager like systemd or PM2 for background management, passing production parameters):

```bash
./target/release/monitor-proxy --port 8080 --allowed-origin https://monitor.example.com
```

### 4. Reverse Proxy Configuration (Nginx Example)

Configure the site so the web server can efficiently serve the Vue static bundle while correctly proxying REST API, SSE, and WebSocket traffic to the backend Rust server.

```nginx
server {
    listen 80;
    server_name monitor.example.com;

    # Serve Vue 3 static artifacts
    location / {
        root /path/to/hsn-phira/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy REST API, SSE stream, and WebSocket requests to the Rust server
    location /api/ {
        proxy_pass http://127.0.0.1:8080/; # Adjust according to the actual PORT configuration
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # WebSocket Upgrade header configuration
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        # For SSE streams (e.g., /rooms/listen), buffering must be disabled to prevent disconnection/latency
        proxy_buffering off;
        proxy_read_timeout 86400; # Prevent long connection drops
    }
}
```
