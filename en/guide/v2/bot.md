# HSNBot

HSNBot is a QQ group bot based on [NoneBot2](https://nonebot.dev/) + [OneBot V11](https://onebot.adapters.nonebot.dev/), providing Phira multiplayer room queries, server monitoring, data statistics, and more.

## Tech Stack

| Component        | Technology                        |
|------------------|-----------------------------------|
| Framework        | NoneBot2                          |
| Protocol Adapter | OneBot V11                        |
| Command System   | Alconna                           |
| HTTP Client      | httpx / aiohttp                   |
| Image Rendering  | nonebot-plugin-htmlrender (Playwright / Chromium) |
| Data Source API  | HSN backend monitoring service (`http://23.141.172.246:7001`) |

## Feature List

### Server Status

| Command             | Description                                                  | File        |
|---------------------|--------------------------------------------------------------|-------------|
| `/cksvr`            | Check if the CK game server is online                        | `ckmp.py`   |
| `/mcstatus`         | Query Minecraft server status and render as image            | `mccheck.py`|
| `/users` / `在线人数` | Get the current number of online players on the Phira server | `users.py`  |

### Room Management

| Command                         | Description                                         | File     |
|---------------------------------|-----------------------------------------------------|----------|
| `/room`                         | Query all current rooms (image)                     | `room.py`|
| `/room record <room_name>`      | Query play records for the specified room           | `room.py`|

The plugin listens to the backend in real-time via SSE, and automatically pushes image notifications to the configured QQ group when a new room is created.

### Data Monitoring

| Command                                               | Description                                              | File       |
|-------------------------------------------------------|----------------------------------------------------------|------------|
| `/hsndata health`                                     | Check the health status of the monitoring API            | `hsndata.py`|
| `/hsndata history [start] [end]`                      | Get HSN historical online data                           | `hsndata.py`|
| `/hsndata chart <start> <end>`                        | Generate an online trend chart for a specified time period| `hsndata.py`|
| `/hsndata charts`                                     | List all generated charts                                | `hsndata.py`|
| `/hsndata image <type>`                               | Get a chart image (hsn / room / user_bar / user_pie)     | `hsndata.py`|
| `/hsndata roomrank`                                   | Room usage frequency ranking                             | `hsndata.py`|
| `/hsndata userrank [user_id]`                         | User playtime ranking or query a specific user           | `hsndata.py`|
| `/hsndata leaderboard [count]`                        | Get the playtime leaderboard                             | `hsndata.py`|
| `/hsndata generate`                                   | Manually trigger chart generation                        | `hsndata.py`|
| `/hsnvs latest`                                       | Get the latest server comparison data and trend chart    | `hsnvs.py`  |
| `/hsnvs history <minutes>`                            | Get data from a specified number of minutes ago          | `hsnvs.py`  |
| `/hsnvs stats`                                        | Get statistics results                                   | `hsnvs.py`  |
| `/hsnvs config show \| update`                        | View or update configuration                             | `hsnvs.py`  |

### Others

| Command                  | Description                                                    | File      |
|--------------------------|----------------------------------------------------------------|-----------|
| `/setu [keyword]`        | Get images via Lolicon API, auto-recall after 10 seconds       | `setu.py` |
| `骂人` / `fuck` / `吃大粪` | Fun replies                                                    | `maren.py`|
| `/restart [api]`         | Restart the Phira server (group owner/admin only)              | `restart.py`|

## Configuration

Configure in `.env` or `.env.prod`:

```env
# Phira Room Plugin
PHIRA_API_BASE=http://23.141.172.246:12345
PHIRA_CHART_API=https://phira.5wyxi.com
PHIRA_NOTIFY_GROUPS=[123456789, 987654321]
PHIRA_FONT_PATH=/path/to/font.ttf
PHIRA_BG_PATH=/path/to/background.jpg
PHIRA_LOGO_PATH=/path/to/logo.png
PHIRA_CACHE_TTL=600
PHIRA_SSE_RETRY=5
PHIRA_IMAGE_QUALITY=90

# CK Server Checker (modify directly in ckmp.py)
# USERNAME="your-email"
# PASSWORD="your-password"

# HSN Data Monitoring
HSN_API_BASE=http://23.141.172.246:7001
```

## Deployment

```bash
# Install dependencies
pip install nonebot2 nonebot-adapter-onebot nonebot-plugin-alconna nonebot-plugin-htmlrender
pip install httpx aiohttp mcstatus

# Configure .env
echo "DRIVER=~fastapi+~httpx" >> .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8080" >> .env

# Start
nb run
```
