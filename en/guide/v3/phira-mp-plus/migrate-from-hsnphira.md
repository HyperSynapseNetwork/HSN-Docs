# Migrating from HSNPhira (user.py) to Phira-mp+

This document explains how to migrate data from the HSNPhira backend (`user.py` + SQLite) to Phira-mp+.

## Data Comparison

| Data Type | HSNPhira (user.py) | Phira-mp+ (PostgreSQL) | Phira-mp+ (JSON Fallback) |
|-----------|--------------------|------------------------|---------------------------|
| Playtime | SQLite `user_playtime` + `user_room_duration` | PostgreSQL `playtime` table | `data/playtime-tracker.json` |
| Room Records | SQLite `rooms` + `user_room_activity` | PostgreSQL `room_history` table | Built-in `room history` command |
| Game Rounds | SQLite `game_rounds` | Round data stored by UUID files | Stored by UUID in `data/rounds/` directory |
| User Data | Phira API real-time query | Authentication cache `data/extensions.json` | `data/extensions.json` |

**Note:** Phira-mp+ prefers PostgreSQL (requires configuring `database_url` in `server_config.yml`).
If not configured, it automatically falls back to JSON file storage.

## Migrating to PostgreSQL

### 1. Enable PostgreSQL in Phira-mp+ Configuration

Edit `server_config.yml`:

```yaml
database_url: "postgres://user:password@localhost:5432/phira_mp_plus"
```

The server will automatically create the database and tables (`playtime`, `room_history`) on startup.

### 2. Export HSNPhira Data

```bash
# Export playtime from HSNPhira's SQLite
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 3. Import to PostgreSQL

```python
import json
import psycopg2

# Connect to PostgreSQL
conn = psycopg2.connect("postgres://user:password@localhost:5432/phira_mp_plus")
cur = conn.cursor()

# Read the exported data
with open('playtime_export.json') as f:
    data = json.load(f)

# Import playtime
for entry in data:
    cur.execute(
        "INSERT INTO playtime (user_id, total_secs, session_start) VALUES (%s, %s, NULL) "
        "ON CONFLICT (user_id) DO UPDATE SET total_secs = EXCLUDED.total_secs",
        (entry['user_id'], int(entry['total_seconds']))
    )

conn.commit()
cur.close()
conn.close()
print("Import complete")
```

### 4. Verify

```bash
# Connect to PostgreSQL and view data
psql "postgres://user:password@localhost:5432/phira_mp_plus"
SELECT * FROM playtime ORDER BY total_secs DESC;
```

## Migrating to JSON Files (No PostgreSQL)

### 1. Export HSNPhira Data

```bash
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 2. Convert to Phira-mp+ JSON Format

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

### 3. Place on the Server

```bash
kill $(pgrep phira-mp-plus-server)
cp data/playtime-tracker.json data/playtime-tracker.json.bak
cp playtime-tracker.json data/
# Restart (ensure database_url is not configured, using JSON fallback)
nohup ./target/debug/phira-mp-plus-server > log/server-output.log 2>&1 &
```

## PostgreSQL Table Structure

```sql
-- Playtime
CREATE TABLE playtime (
    user_id INTEGER PRIMARY KEY,
    total_secs BIGINT NOT NULL DEFAULT 0,
    session_start BIGINT
);

-- Room visit history
CREATE TABLE room_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id TEXT NOT NULL,
    room_uuid TEXT NOT NULL,
    joined_at BIGINT NOT NULL
);
```

## Related Commands

```bash
# View playtime
playtime <user_id>

# View room history
room history <room_id>

# View welcome message configuration (including placeholder list)
welcome-config
```
