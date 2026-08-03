# Phira-mp+ CLI 命令文档

## 启动参数

```
phira-mp-plus-server [OPTIONS]

  -p, --port <PORT>          服务器监听端口 [默认: 12346]
  -d, --plugins-dir <DIR>    WASM 插件目录路径 [默认: "plugins"]
  -e, --ext-file <FILE>      扩展数据持久化 JSON 文件路径 [默认: "data/extensions.json"]
      --no-cli               禁用交互式 CLI 管理控制台
  -l, --log-file <NAME>      日志文件基础名称 [默认: "phira-mp-plus"]
  -m, --monitor <IDS>...     允许旁观的用户 ID（可多次指定，如 `-m 1 -m 2`）
      --http-port <PORT>     HTTP/SSE 服务端口 [默认: 12347]
      --proxy-port <PORT>    可信转发头兼容端口（不是 PROXY v1/v2；默认 0 = 禁用）
  -c, --config <FILE>        YAML 配置文件路径 [默认: "server_config.yml"]
  -h, --help                 显示帮助信息
  -V, --version              显示版本号
```

配置加载顺序（后覆盖前）：YAML 配置文件 < 环境变量 < CLI 参数。

## 交互式管理控制台

服务器在普通交互式终端和 tmux 中启动 ratatui 管理控制台。GNU Screen 环境自动切换为逐行兼容控制台，不输出颜色、备用屏幕、鼠标或 Bracketed Paste 控制序列；重定向、systemd 和其他非 TTY 环境也使用逐行控制台。设置 `NO_COLOR` 可在其他终端中关闭颜色。

`help` 无参数时显示全部命令清单；`help <命令>` 查看指定命令的用法、参数、示例。

### 通用命令

| 命令 | 说明 |
|------|------|
| `help [命令]` | 显示帮助（无参数显示全部命令） |
| `exit` | 关闭服务器 |
| `status` | 显示服务器运行状态 |
| `version` | 显示服务器版本号 |
| `check-config` | 验证当前加载的配置并显示脱敏摘要 |
| `doctor` | 运行系统诊断检查 |
| `config reload` | 重新加载 YAML 配置（热更新 chat_enabled、monitors、显式管理员） |
| `roomcreation [on\|off]` | 开关玩家建房功能（无参数显示当前状态） |

### 用户管理

| 命令 | 说明 |
|------|------|
| `users` | 列出在线用户 |
| `kick <用户ID>` | 从服务器踢出用户 |
| `admin-id list\|add\|remove` | 管理游戏内管理员 Phira ID |
| `broadcast all <消息>` | 广播给所有用户 |
| `broadcast room <房间ID> <消息>` | 广播给指定房间 |
| `broadcast user <用户ID> <消息>` | 发送给指定用户 |

### 房间管理

| 命令 | 说明 |
|------|------|
| `rooms` | 列出活跃房间 |
| `room info <房间ID>` | 房间详情 |
| `room create-empty <房间ID>` | 创建无人持久空房间 |
| `room start <房间ID>` | 强制开始游戏（`force-start` 为旧别名） |
| `room cancel <房间ID>` | 取消管理员发起的游戏开始 |
| `room ready <房间ID> [用户ID]` | 让房间进入准备状态，或强制指定玩家准备 |
| `room kick <房间ID> <用户ID>` | 从房间踢出用户 |
| `room host <房间ID> <用户ID\|?>` | 设置房主；`?`/`system`/`-`/`none`/`null` 均表示**系统房主**（host -1） |
| `room force-move <房间ID> <用户ID>` | 强制迁移用户到指定房间 |
| `room hide\|unhide <房间ID>` | 隐藏/取消隐藏房间 |
| `room close <房间ID>` | 解散房间 |
| `room lock <房间ID> [true\|false]` | 锁定/解锁房间 |
| `room cycle <房间ID> [true\|false]` | 开启/关闭房主轮换 |
| `room set <房间ID> <字段> <值>` | 修改房间设置 |
| `room history <房间ID>` | 查看游玩记录 |
| `room rounds <房间ID>` / `room round <轮次UUID>` | 查看轮次列表/详情 |
| `room uuid <房间ID>` | 查看房间 UUID |
| `room ban\|unban <房间ID> <用户ID>` | 房间加入/移出黑名单 |
| `room banlist <房间ID>` | 房间黑名单列表 |

**`room set` 支持字段**：`lock` `cycle` `hidden` `persistent` `degraded` `host` `chart-id` `phira_api_endpoint`。

- `persistent true`：把房间转为**持久空房间**（房间空置后保留，服务器重启自动恢复）；`persistent false` 取消
- `degraded true`：清除房间持久化降级状态
- `host ?` / `host system`：设为系统房主（host -1）

### 插件管理（WASM）

| 命令 | 说明 |
|------|------|
| `plugin list` | 列出所有已加载的 WASM 插件 |
| `plugin enable <名>` | 启用指定插件 |
| `plugin disable <名>` | 禁用指定插件 |
| `plugin remove <名>` | 卸载并删除插件文件和数据 |
| `plugin reload` | 重载所有 WASM 插件 |
| `plugin info <名>` | 显示插件详细信息 |
| `plugin call <名> <方法> [JSON参数]` | 调用插件导出 API |

### 封禁管理

| 命令 | 说明 |
|------|------|
| `ban <用户ID> [原因]` | 封禁用户 |
| `ban ip <IP> [原因]` | 封禁 IP |
| `unban <用户ID>` / `unban ip <IP>` | 解封用户/IP |
| `banlist` / `banlist ip` | 列出封禁列表 |
| `ip-history <用户ID>` | 查看用户使用过的 IP |

### 扩展数据

| 命令 | 说明 |
|------|------|
| `extension list` | 列出所有已注册扩展字段 |
| `extension get <用户ID\|房间ID> <key>` | 获取指定用户/房间的扩展数据 |

### 基准测试

| 命令 | 说明 |
|------|------|
| `benchmark list` | 列出可用场景与预设 |
| `benchmark run --scenario <名> [选项]` | 运行基准测试 |
| `benchmark suite [--preset]` | 按预设顺序运行全部场景 |
| `benchmark compare <旧.json> <新.json>` | 比较两份基准报告 |

### 运行时诊断

| 命令 | 说明 |
|------|------|
| `runtime status` | 运行时诊断总览 |
| `runtime phira` | Phira HTTP 客户端统计 |
| `runtime commands` | 命令注册表统计 |
| `runtime events` | 事件总线统计 |
| `runtime persistence` | 持久化 Worker 与遥测统计 |
| `runtime schema` | 持久化 schema 说明 |
| `runtime latency` | 打印响应/握手延迟直方图 |

### 运维工具

| 命令 | 说明 |
|------|------|
| `wal inspect` | 查看 WAL 状态 |
| `dead-letter list [limit]` / `dead-letter replay` | 查看/重放 dead-letter 记录 |
| `approve openuds <pending_id>` | 批准挂起的 OpenUDS 连接（仅 Unix） |
| `welcome-config` | 查看欢迎语配置与占位符说明 |
| `player-count` | 查看游玩过的玩家总数 |

## Web API

中央 HTTP/SSE 服务器监听配置的 `--http-port`（默认 12347）。

| 端点 | 说明 |
|------|------|
| `GET /api/events` | 统一 SSE 端点 |
| `GET /api/ws` | WebSocket 实时监测 |
| `GET /health/live` | 存活探针 |
| `GET /health/ready` | 就绪探针 |

插件注册的 HTTP 路由经 `/{*path}` 动态挂载（如房间列表 `/api/rooms`、房间事件流 `/rooms/listen` 等由插件声明）。详细 API 文档见 [api.md](api.md)。

## WASM 插件系统

服务器支持通过 wasmtime 加载 `.wasm` 插件。插件需放置在 `plugins/` 目录（可通过 `-d` 自定义）。
插件通过 `phira:host/api` 导入函数访问服务器全部能力：

- 状态查询：rooms.list, player.touches, round.data 等
- 消息发送：send.to_user, send.to_room, send.to_all
- 房间管理：room.kick, room.set_host, room.set_lock, room.close
- 用户管理：admin.kick_user, admin.ban_user, admin.unban_user, admin.is_banned
- 插件互调用：plugin.api_call, plugin.api_register
- 数据读写：ext.get/set, config.get/set, file.read/write
- HTTP 请求：http.get/post

具体接口定义见 `wit/phira-plugin.wit`。

## 日志文件

日志文件存储在 `log/` 目录下，按小时轮转。

日志级别通过 `RUST_LOG` 环境变量控制：

```bash
RUST_LOG=info phira-mp-plus-server
RUST_LOG=debug phira-mp-plus-server
```
