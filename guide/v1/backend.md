# HSNPhira v1 后端

HSNPhira v1 后端采用 Python Flask 框架，由多个独立微服务组成，提供用户管理、房间监控、命令执行和文件服务等功能。

## 服务架构概览

| 服务 | 端口 | 技术栈 | 说明 |
|------|------|--------|------|
| user_manager | 2345 | Flask + SQLite | 用户注册/登录/信息管理，Phira 数据同步 |
| room | 5000 | Flask + 日志解析 | 实时房间状态监控（日志驱动） |
| api | 5001 | Flask + SQLite | 房间数据采集与统计分析（API 驱动） |
| command | 7878 | Flask | 安全命令执行（白名单 + 密码验证） |
| file | 7880 | Flask | 文件内容服务 |

---

## 1. user_manager (端口 2345)

用户账号管理核心服务。

### 功能

- **用户注册** (`POST /register`) — 绑定 Phira 账号注册，密码加盐哈希存储
- **用户登录** (`POST /login`) — 密码验证，返回用户信息
- **用户信息查询** (`POST /info`) — 管理员/超级管理员权限可查询
- **用户信息修改** (`POST /info_changer`) — 修改用户名、密码、Phira ID、权限等
- **管理员接口** — 用户列表查询、单用户更新、批量更新
- **Phira 数据同步** — 后台线程定时从 `phira.5wyxi.com` API 更新用户头像和 RKS

### 数据库

- **文件**: `phira_users.db` (SQLite)
- **表 `users`**: id, name, phira_id, phira_name, phira_rks, image_url, password(哈希), admin, dev, created_at

### 认证

| 角色 | 凭据 | 权限 |
|------|------|------|
| 超级管理员 | 固定密码（代码中配置） | 完全控制，可修改密码/权限字段 |
| 普通管理员 | 固定密码（代码中配置） | 查用户信息，修改非权限字段 |

---

## 2. room (端口 5000)

基于日志驱动的实时房间状态监控服务。通过实时读取 `phira-mp/server.log` 追踪房间事件。

### 功能

- **日志监控** — 实时跟踪日志文件，解析房间创建/加入/离开/解散事件
- **房间状态追踪** — 记录房间状态（选谱中/进行中）、循环开关、谱面选择
- **用户映射** — 维护 user_id → username 和 user_id → room_name 映射
- **持久化** — 用户映射关系写入 `user_info.json`

### API

| 端点 | 说明 |
|------|------|
| `GET /rooms` | 获取所有房间详细信息 |
| `GET /status` | 系统状态（房间数、用户数） |
| `GET /health` | 健康检查 |
| `GET /users/total` | 注册用户总数统计 |

### 后台线程

- **日志追踪** (tail_log) — 实时读取日志文件变更
- **房间清理** (room_cleanup_task) — 每 60 秒清理超过 1 小时无活动的房间

---

## 3. api (端口 5001)

基于 API 驱动的房间数据采集与统计服务。轮询 `phira.htadiy.cc/api/rooms/info` 获取数据。

### 功能

- **房间监控** — 每秒从 Phira API 拉取房间列表并存入数据库
- **用户进出追踪** — 记录用户进入/离开房间的时间和停留时长
- **游戏回合追踪** — 记录游戏开始/结束时间、用户游玩时长
- **在线人数统计**

### 数据库

- **文件**: `phira_stats.db` (SQLite)
- **表**: rooms, user_room_activity, user_room_duration, game_rounds, user_playtime

| 端点 | 说明 |
|------|------|
| `GET /users` | 当前在线总人数 |

### 后台线程

- **房间监控** (room_monitor_service) — 每秒轮询 API，更新数据库

---

## 4. command (端口 7878)

安全的远程命令执行服务。

### 功能

- **白名单命令** — 预定义的受控命令（start/restart/stop/serverinfo）
- **自定义命令** — 允许执行任意命令（可通过配置开关）
- **三层密码验证** — 需同时提供三个密码片段进行身份认证
- **危险命令黑名单** — 阻止 rm -rf /、mkfs、shutdown 等危险操作

### API

| 端点 | 说明 |
|------|------|
| `POST /execute` | 执行命令（白名单或自定义） |

### 安全机制

- 所有命令通过 `shlex.split` 安全解析
- 危险命令黑名单拦截
- 密码使用 `werkzeug.security.check_password_hash` 验证

---

## 5. file (端口 7880)

简单的文件内容服务。

### 功能

- 读取并返回指定路径的文件内容（默认 `/root/user_info.json`）
- 支持通过环境变量 `FILE_PATH` 配置目标文件

### API

| 端点 | 说明 |
|------|------|
| `GET /api` | 返回文件内容 |

---

## 启动方式

```bash
# 用户管理服务
python user_manager.py       # → :2345

# 房间监控服务（日志驱动）
python room.py               # → :5000

# 房间监控服务（API 驱动）
python api.py                # → :5001

# 命令执行服务
python command.py            # → :7878

# 文件服务
python file.py               # → :7880
```

## 依赖

- `flask` — Web 框架
- `werkzeug.security` — 密码哈希
- `sqlite3` — 数据库（Python 内置）
- `requests` — HTTP 请求（房间 API 采集）
- `threading` — 后台线程（Python 内置）
