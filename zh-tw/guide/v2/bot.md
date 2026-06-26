# HSNBot

HSNBot 是基於 [NoneBot2](https://nonebot.dev/) + [OneBot V11](https://onebot.adapters.nonebot.dev/) 的 QQ 群機器人，提供 Phira 多人房間查詢、伺服器監控、資料統計等功能。

## 技術棧

| 元件 | 技術 |
|------|------|
| 框架 | NoneBot2 |
| 協定適配 | OneBot V11 |
| 命令系統 | Alconna |
| HTTP 客戶端 | httpx / aiohttp |
| 圖片渲染 | nonebot-plugin-htmlrender (Playwright / Chromium) |
| 資料來源 API | HSN 後端監控服務 (`http://23.141.172.246:7001`) |

## 功能列表

### 伺服器狀態

| 命令 | 說明 | 檔案 |
|------|------|------|
| `/cksvr` | 檢查 CK 遊戲伺服器是否在線 | `ckmp.py` |
| `/mcstatus` | 查詢 Minecraft 伺服器狀態並渲染為圖片 | `mccheck.py` |
| `/users` / `在線人數` | 獲取 Phira 伺服器當前線上玩家數 | `users.py` |

### 房間管理

| 命令 | 說明 | 檔案 |
|------|------|------|
| `/room` | 查詢當前所有房間（圖片） | `room.py` |
| `/room record <房間名>` | 查詢指定房間的遊玩記錄 | `room.py` |

插件透過 SSE 即時監聽後端，新房間建立時自動推送圖片通知到配置的 QQ 群。

### 資料監控

| 命令 | 說明 | 檔案 |
|------|------|------|
| `/hsndata health` | 檢查監控 API 健康狀態 | `hsndata.py` |
| `/hsndata history [開始] [結束]` | 獲取 HSN 歷史線上資料 | `hsndata.py` |
| `/hsndata chart <開始> <結束>` | 生成指定時段的線上趨勢圖表 | `hsndata.py` |
| `/hsndata charts` | 列出所有已生成的圖表 | `hsndata.py` |
| `/hsndata image <類型>` | 獲取圖表圖片（hsn / room / user_bar / user_pie） | `hsndata.py` |
| `/hsndata roomrank` | 房間使用次數排名 | `hsndata.py` |
| `/hsndata userrank [用戶ID]` | 用戶遊玩時間排名或查詢指定用戶 | `hsndata.py` |
| `/hsndata leaderboard [數量]` | 獲取遊玩時間排行榜 | `hsndata.py` |
| `/hsndata generate` | 手動觸發圖表生成 | `hsndata.py` |
| `/hsnvs latest` | 獲取最新的伺服器對比資料和趨勢圖 | `hsnvs.py` |
| `/hsnvs history <分鐘數>` | 獲取指定分鐘前的資料 | `hsnvs.py` |
| `/hsnvs stats` | 獲取統計結果 | `hsnvs.py` |
| `/hsnvs config show \| update` | 查看或更新配置 | `hsnvs.py` |

### 其他

| 命令 | 說明 | 檔案 |
|------|------|------|
| `/setu [關鍵詞]` | 透過 Lolicon API 獲取圖片，10 秒後自動收回 | `setu.py` |
| `罵人` / `fuck` / `吃大糞` | 趣味回覆 | `maren.py` |
| `/restart [api]` | 重啟 Phira 伺服器（僅群主/管理員可用） | `restart.py` |

## 配置

在 `.env` 或 `.env.prod` 中配置：

```env
# Phira 房間插件
PHIRA_API_BASE=http://23.141.172.246:12345
PHIRA_CHART_API=https://phira.5wyxi.com
PHIRA_NOTIFY_GROUPS=[123456789, 987654321]
PHIRA_FONT_PATH=/path/to/font.ttf
PHIRA_BG_PATH=/path/to/background.jpg
PHIRA_LOGO_PATH=/path/to/logo.png
PHIRA_CACHE_TTL=600
PHIRA_SSE_RETRY=5
PHIRA_IMAGE_QUALITY=90

# CK 伺服器檢查器（在 ckmp.py 中直接修改）
# USERNAME="your-email"
# PASSWORD="your-password"

# HSN 資料監控
HSN_API_BASE=http://23.141.172.246:7001
```

## 部署

```bash
# 安裝依賴
pip install nonebot2 nonebot-adapter-onebot nonebot-plugin-alconna nonebot-plugin-htmlrender
pip install httpx aiohttp mcstatus

# 配置 .env
echo "DRIVER=~fastapi+~httpx" >> .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8080" >> .env

# 啟動
nb run
```
