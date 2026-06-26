# HSNBot

HSNBot 是基于 [NoneBot2](https://nonebot.dev/) + [OneBot V11](https://onebot.adapters.nonebot.dev/) 的 QQ 群机器人，提供 Phira 多人房间查询、服务器监控、数据统计等功能。

## 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | NoneBot2 |
| 协议适配 | OneBot V11 |
| 命令系统 | Alconna |
| HTTP 客户端 | httpx / aiohttp |
| 图片渲染 | nonebot-plugin-htmlrender (Playwright / Chromium) |
| 数据源 API | HSN 后端监控服务 (`http://23.141.172.246:7001`) |

## 功能列表

### 服务器状态

| 命令 | 说明 | 文件 |
|------|------|------|
| `/cksvr` | 检查 CK 游戏服务器是否在线 | `ckmp.py` |
| `/mcstatus` | 查询 Minecraft 服务器状态并渲染为图片 | `mccheck.py` |
| `/users` / `在线人数` | 获取 Phira 服务器当前在线玩家数 | `users.py` |

### 房间管理

| 命令 | 说明 | 文件 |
|------|------|------|
| `/room` | 查询当前所有房间（图片） | `room.py` |
| `/room record <房间名>` | 查询指定房间的游玩记录 | `room.py` |

插件通过 SSE 实时监听后端，新房间创建时自动推送图片通知到配置的 QQ 群。

### 数据监控

| 命令 | 说明 | 文件 |
|------|------|------|
| `/hsndata health` | 检查监控 API 健康状态 | `hsndata.py` |
| `/hsndata history [开始] [结束]` | 获取 HSN 历史在线数据 | `hsndata.py` |
| `/hsndata chart <开始> <结束>` | 生成指定时段的在线趋势图表 | `hsndata.py` |
| `/hsndata charts` | 列出所有已生成的图表 | `hsndata.py` |
| `/hsndata image <类型>` | 获取图表图片（hsn / room / user_bar / user_pie） | `hsndata.py` |
| `/hsndata roomrank` | 房间使用次数排名 | `hsndata.py` |
| `/hsndata userrank [用户ID]` | 用户游玩时间排名或查询指定用户 | `hsndata.py` |
| `/hsndata leaderboard [数量]` | 获取游玩时间排行榜 | `hsndata.py` |
| `/hsndata generate` | 手动触发图表生成 | `hsndata.py` |
| `/hsnvs latest` | 获取最新的服务器对比数据和趋势图 | `hsnvs.py` |
| `/hsnvs history <分钟数>` | 获取指定分钟前的数据 | `hsnvs.py` |
| `/hsnvs stats` | 获取统计结果 | `hsnvs.py` |
| `/hsnvs config show \| update` | 查看或更新配置 | `hsnvs.py` |

### 其他

| 命令 | 说明 | 文件 |
|------|------|------|
| `/setu [关键词]` | 通过 Lolicon API 获取图片，10 秒后自动撤回 | `setu.py` |
| `骂人` / `fuck` / `吃大粪` | 趣味回复 | `maren.py` |
| `/restart [api]` | 重启 Phira 服务器（仅群主/管理员可用） | `restart.py` |

## 配置

在 `.env` 或 `.env.prod` 中配置：

```env
# Phira 房间插件
PHIRA_API_BASE=http://23.141.172.246:12345
PHIRA_CHART_API=https://phira.5wyxi.com
PHIRA_NOTIFY_GROUPS=[123456789, 987654321]
PHIRA_FONT_PATH=/path/to/font.ttf
PHIRA_BG_PATH=/path/to/background.jpg
PHIRA_LOGO_PATH=/path/to/logo.png
PHIRA_CACHE_TTL=600
PHIRA_SSE_RETRY=5
PHIRA_IMAGE_QUALITY=90

# CK 服务器检查器（在 ckmp.py 中直接修改）
# USERNAME="your-email"
# PASSWORD="your-password"

# HSN 数据监控
HSN_API_BASE=http://23.141.172.246:7001
```

## 部署

```bash
# 安装依赖
pip install nonebot2 nonebot-adapter-onebot nonebot-plugin-alconna nonebot-plugin-htmlrender
pip install httpx aiohttp mcstatus

# 配置 .env
echo "DRIVER=~fastapi+~httpx" >> .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8080" >> .env

# 启动
nb run
```
