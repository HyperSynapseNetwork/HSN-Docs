# HSNPhira (user.py) から Phira-mp+ への移行

このドキュメントでは、HSNPhira バックエンド（`user.py` + SQLite）のデータを Phira-mp+ に移行する方法を説明します。

## データ比較

| データタイプ | HSNPhira (user.py) | Phira-mp+（PostgreSQL） | Phira-mp+（JSON フォールバック） |
|----------|-------------------|------------------------|----------------------|
| プレイ時間 | SQLite `user_playtime` + `user_room_duration` | PostgreSQL `playtime` テーブル | `data/playtime-tracker.json` |
| ルーム記録 | SQLite `rooms` + `user_room_activity` | PostgreSQL `room_history` テーブル | 内蔵 `room history` コマンド |
| ゲームラウンド | SQLite `game_rounds` | ラウンドデータは UUID ファイルとして保存 | `data/rounds/` ディレクトリに UUID 単位で保存 |
| ユーザーデータ | Phira API リアルタイム照会 | 認証キャッシュ `data/extensions.json` | `data/extensions.json` |

**注意：** Phira-mp+ は優先的に PostgreSQL を使用します（`server_config.yml` で `database_url` を設定する必要があります）。
設定がない場合は自動的に JSON ファイルストレージにフォールバックします。

## PostgreSQL への移行

### 1. Phira-mp+ 設定で PostgreSQL を有効化

`server_config.yml` を編集：

```yaml
database_url: "postgres://user:password@localhost:5432/phira_mp_plus"
```

サーバー起動時に自動的にデータベースとテーブル（`playtime`、`room_history`）が作成されます。

### 2. HSNPhira データをエクスポート

```bash
# HSNPhira の SQLite からプレイ時間をエクスポート
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 3. PostgreSQL にインポート

```python
import json
import psycopg2

# PostgreSQL に接続
conn = psycopg2.connect("postgres://user:password@localhost:5432/phira_mp_plus")
cur = conn.cursor()

# エクスポートしたデータを読み込み
with open('playtime_export.json') as f:
    data = json.load(f)

# プレイ時間をインポート
for entry in data:
    cur.execute(
        "INSERT INTO playtime (user_id, total_secs, session_start) VALUES (%s, %s, NULL) "
        "ON CONFLICT (user_id) DO UPDATE SET total_secs = EXCLUDED.total_secs",
        (entry['user_id'], int(entry['total_seconds']))
    )

conn.commit()
cur.close()
conn.close()
print("インポート完了")
```

### 4. 確認

```bash
# PostgreSQL に接続してデータを確認
psql "postgres://user:password@localhost:5432/phira_mp_plus"
SELECT * FROM playtime ORDER BY total_secs DESC;
```

## JSON ファイルへの移行（PostgreSQL なし）

### 1. HSNPhira データをエクスポート

```bash
sqlite3 phira_stats.db -json "SELECT user_id, SUM(play_duration) as total_seconds FROM user_playtime GROUP BY user_id" > playtime_export.json
```

### 2. Phira-mp+ JSON 形式に変換

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

### 3. サーバーに配置

```bash
kill $(pgrep phira-mp-plus-server)
cp data/playtime-tracker.json data/playtime-tracker.json.bak
cp playtime-tracker.json data/
# 再起動（database_url が未設定の場合は JSON フォールバックを使用）
nohup ./target/debug/phira-mp-plus-server > log/server-output.log 2>&1 &
```

## PostgreSQL テーブル構造

```sql
-- プレイ時間
CREATE TABLE playtime (
    user_id INTEGER PRIMARY KEY,
    total_secs BIGINT NOT NULL DEFAULT 0,
    session_start BIGINT
);

-- ルーム訪問履歴
CREATE TABLE room_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id TEXT NOT NULL,
    room_uuid TEXT NOT NULL,
    joined_at BIGINT NOT NULL
);
```

## 関連コマンド

```bash
# プレイ時間を表示
playtime <user_id>

# ルーム履歴を表示
room history <room_id>

# ウェルカムメッセージ設定を表示（プレースホルダー一覧含む）
welcome-config
```
