# HSNPhira v1 Frontend

HSNPhira v1 Frontend is built with pure HTML + CSS + JavaScript, featuring a dark theme design with Glassmorphism and 3D card interactions. All pages are powered by shared backend APIs.

## Page List

| Page | Description | Access |
|------|------|----------|
| `index.html` | Homepage / Login & Register | Public |
| `rooms.html` | Room List | Public |
| `account.html` | Account Management | Login required |
| `admin.html` | Admin Console (Server Control + User Management) | Admin privileges required |
| `privacy.html` | User Agreement / Privacy Policy | Public |

---

## 1. Homepage (index.html)

The project's landing page, used to display a server overview and guide users.

### Content

- **Navigation Bar** — Logo + page links (Home, Room List)
- **Hero Section** — Full-screen background image (fade-in animation), title "HyperSynapse Network Phira Multiplayer Game Server"
- **User Count Stats** — Fetches and displays total registered users via `fetch("/usertotal")`
- **QQ Group Guide** — Displays QQ group number (1049578201) with one-click copy support

### Interactions

- Each section triggers fade-in animations via IntersectionObserver on scroll
- User avatar dropdown menu (visible after login)

---

## 2. Room List (rooms.html)

Real-time display of Phira multiplayer room status.

### Features

- **Server Status Indicator** — Checks server online status via `HEAD /roomsjson`
- **Room List Table** — Displays room name, host, player count, cycle status, chart, cover art, download, and members

| Column | Description |
|----|------|
| Room Name | Name of the room |
| Host | Host name (linked to Phira user page) |
| Players | Number of users currently in the room |
| Cycle | Whether cycle mode is enabled |
| Chart | Currently selected chart name (linked to Phira chart page) |
| Cover Art | Chart cover thumbnail (click to enlarge preview) |
| Download | Chart file download button |
| Players | View list of users in the room |

### Data Retrieval

- `GET /roomsjson` — Get room list JSON
- `GET https://phira.5wyxi.com/chart/{id}` — Get chart metadata (name, cover art, file)

### Interaction Details

- 3D tilt following effect — table produces rotation parallax on mouse movement
- Cover art click to enlarge (Lightbox)
- Room user list popup window (host highlighted)
- Forced landscape orientation adaptation (mobile devices)
- Login/Register popup (shared with `account.html`)

---

## 3. Account Management (account.html)

Users can view and modify their account information.

### Features

- **User Info Display** — Avatar, username, ID, Phira ID, RKS, registration date, permission badge
- **Change Username** — Enter new username + current password confirmation
- **Change Password** — Current password → new password → confirm new password (minimum 6 characters)
- **Permission Info** — Display admin/developer status (read-only)

### Info Cards

| Area | Content |
|------|------|
| Avatar Area | Large avatar + name + ID |
| Stats Area | RKS value, registration date, online status |
| Info Grid | Username, Phira username, account status, last login time |
| Permission Grid | Admin status, developer permissions |

### API Interactions

- `POST /usermgr/login` — Login
- `POST /usermgr/register` — Register
- `POST /usermgr/update_account` — Update username/password

---

## 4. Admin Console (admin.html)

Server operation management interface with two tabs.

### 4.1 Server Control

| Feature | Description |
|------|------|
| Server Status | Checks runtime status via `/execute` calling `check.sh` |
| API Status | Checks if API is online via `GET /roomsjson` |
| Service Control | Start/Restart/Shutdown (corresponding to `start.sh`, `stop.sh`) |
| Custom Commands | Input any shell command to execute |

### 4.2 User Management

| Feature | Description |
|------|------|
| User List | Table displaying all users (ID, username, avatar, Phira ID, RKS, permissions) |
| Search Filter | Search by username/Phira ID, filter by admin/developer status |
| Batch Operations | Batch set/cancel admin or developer permissions |
| Edit User | Modify username, password, Phira ID, admin/developer status |

### Security

- Requires login with admin privileges (`admin === "yes"`)
- Modifying sensitive fields (admin, dev, password) requires super admin password
- Admin password verification popup appears before operations

### API Interactions

- `POST /admin/users` — Get user list
- `POST /admin/update` — Update single user
- `POST /admin/batch-update` — Batch update users
- `POST /postadmin/execute` — Execute server commands (requires triple password verification)

---

## 5. User Agreement (privacy.html)

Legal document page containing the user agreement and privacy policy.

---

## Design Style

- **Theme** — Dark (`background: #000`), full-screen background image
- **UI Style** — Glassmorphism effect (`backdrop-filter: blur()`), semi-transparent borders
- **Interactions** — 3D card tilt following, hover enlarge/glow, fade-in animations
- **Brand Color** — Ice blue (`#a1e5ef`)

## Shared Components

- **Navigation Bar** — Shared across pages, includes Logo + nav links + user status
- **Login/Register Popup** — Reusable component supporting login/register mode toggle
- **User Dropdown Menu** — Displays username, avatar, Phira link, account management entry, logout
- **Message Toast** — Success/error message bar, auto-hides after 5 seconds

## Tech Stack

- Pure HTML5 + CSS3 (no frontend framework)
- Native JavaScript (ES6+, `async/await`, `fetch`)
- Local Storage (`localStorage`) for login state persistence
- IntersectionObserver for scroll animations