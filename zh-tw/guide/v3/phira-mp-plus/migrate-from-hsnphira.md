# 從 HSNPhira (user.py) 遷移到 Phira-mp+

本文檔說明如何將 HSNPhira 後端（`user.py` + SQLite）的資料遷移到 Phira-mp+。

## 資料對比

| 資料類型 | HSNPhira (user.py) | Phira-mp+（PostgreSQL） | Phira-mp+（JSON 回退） |
|----------|-------------------|------------------------|----------------------|
| 遊玩時間 | SQLite `user_playtime` + `user_room_duration` | PostgreSQL `playtime` 表 | `data/playtime-tracker.json` |
| 房間記錄 | SQLite `rooms` + `user_room_activity` | PostgreSQL `room_history` 表 | 內建 `room history` 命令 |
| 遊戲輪次 | SQLite `game_rounds` | 輪次資料按 UUID 檔案儲存 | `data/rounds/` 目錄下按 UUID 儲存 |
| 使用者資料 | Phira API 即時查詢 | 認證快取 `data/extensions.json` | `data/extensions.json` |

**注意：** Phira-mp+ 優先使用 PostgreSQL（需在 `server_config.yml` 中配置 `database_url`）。
未配置時自動回退 JSON 檔案儲存。

## 遷移到 PostgreSQL

### 1. 在 Phira-mp+ 配置中啟用 PostgreSQL

編輯 `server_config.yml`：

```yaml
database_url: "postgres://user:password@localhost:5432/phira_mp_plus"
```

伺服器啟動時會自動建立資料庫和表（`playtime`、`room_history`）。

### 2. 匯出 HSNPhira 資料

```bash
# 從 HSNPhira 的 SQLite 匯出遊玩時間
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 3. 匯入到 PostgreSQL

```python
import json
import psycopg2

# 連線 PostgreSQL
conn = psycopg2.connect("postgres://user:password@localhost:5432/phira_mp_plus")
cur = conn.cursor()

# 讀取匯出的資料
with open('playtime_export.json') as f:
    data = json.load(f)

# 匯入遊玩時間
for entry in data:
    cur.execute(
        "INSERT INTO playtime (user_id, total_secs, session_start) VALUES (%s, %s, NULL) "
        "ON CONFLICT (user_id) DO UPDATE SET total_secs = EXCLUDED.total_secs",
        (entry['user_id'], int(entry['total_seconds']))
    )

conn.commit()
cur.close()
conn.close()
print("匯入完成")
```

### 4. 驗證

```bash
# 連線 PostgreSQL 檢視資料
psql "postgres://user:password@localhost:5432/phira_mp_plus"
SELECT * FROM playtime ORDER BY total_secs DESC;
```

## 遷移到 JSON 檔案（無 PostgreSQL）

### 1. 匯出 HSNPhira 資料

```bash
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 2. 轉換為 Phira-mp+ JSON 格式

```python
import json
import requests

with open('playtime_export.json') as f:
    playtime_data = json.load(f)

result = {}
for entry in playtime_data:
    uid = str(entry['user_id'])
    total_secs = int(entry['total_seconds'])
    result[uid] = {
        "total_secs": total_secs,
        "session_start": None
    }

with open('playtime-tracker.json', 'w') as f:
    json.dump(result, f, indent=2)
```

### 3. 放置到伺服器

```bash
kill $(pgrep phira-mp-plus-server)
cp data/playtime-tracker.json data/playtime-tracker.json.bak
cp playtime-tracker.json data/
# 重啟（確保 database_url 未配置，使用 JSON 回退）
nohup ./target/debug/phira-mp-plus-server > log/server-output.log 2>&1 &
```

## PostgreSQL 表結構

```sql
-- 遊玩時間
CREATE TABLE playtime (
    user_id INTEGER PRIMARY KEY,
    total_secs BIGINT NOT NULL DEFAULT 0,
    session_start BIGINT
);

-- 房間訪問歷史
CREATE TABLE room_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id TEXT NOT NULL,
    room_uuid TEXT NOT NULL,
    joined_at BIGINT NOT NULL
);
```

## 相關命令

```bash
# 檢視遊玩時間
playtime <user_id>

# 檢視房間歷史
room history <room_id>

# 檢視歡迎語配置（含佔位符列表）
welcome-config
```
