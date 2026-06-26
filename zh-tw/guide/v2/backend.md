# HSH-Phira 後端重製版

## 執行方式

### 開發環境

本項目使用 uv 進行管理。假設您已經克隆（完整）倉庫至目錄 HSNPhira，並且安裝了 uv，接下來以此執行下面的命令：

```bash
# 進入後端目錄
cd HSNPhira/backend
# 安裝依賴
uv sync
# 初始化資料庫（僅在第一次執行伺服器之前執行）
uv run flask seed_db
# 執行
uv run flask run --debug --host=0.0.0.0 --port=5000
```

### 生產環境

咕。

## API 文檔

### 用戶管理 api

#### 用戶權限

本項目透過用戶組的方式實現權限管理。每個組具有屬性 permissions，這是一個位掩碼，其中一些值如下：

| 標識               | 值           | 解釋               |
| ------------------ | ------------ | ------------------ |
| `NONE`             | `0`          | 沒有任何權限       |
| `ALL`              | `0xffffffff` | 擁有所有權限       |
| `IMPORT`           | `0x00000001` | 表示用戶為重要用戶 |
| `USER_MANAGEMENT`  | `0x00000002` | 擁有用戶管理權限   |
| `GROUP_MANAGEMENT` | `0x00000004` | 擁有用戶組管理權限 |

初始時會創建一個用戶和三個用戶組：

| 用戶名 | 用戶 ID | 用戶所屬組  |
| ------ | ------- | ----------- |
| root   | 1       | super_admin |

| 組名  | 組 ID | 擁有權限                       |
| ----- | ----- | ------------------------------ |
| root  | 1     | `ALL`                          |
| admin | 2     | `IMPORTANT`、`USER_MANAGEMENT` |
| user  | 3     | `NONE`                         |

---

#### `POST /api/auth/login`

**說明**：登入用戶

**請求資料格式**：

```json
{
  "username": /*字串，用戶名*/,
  "password": /*字串，密碼*/,
  "remember": /*布林值，是否記住用戶*/
}
```

**響應資料格式**：登入的用戶資訊，格式見 `/api/auth/me`。

---

#### `POST /api/auth/logout`

**說明**：登出用戶

---

#### `GET /api/auth/me`

**說明**：取得當前用戶資訊

**響應資料格式**：

```json
{
  "id": /*整數，用戶 ID*/,
  "group_id": /*整數，用戶所在組 ID*/,
  "username": /*字串，用戶名*/,
  "phira_id": /*整數，用戶的綁定的 Phira 帳號 ID*/,
  "phira_username": /*字串，用戶的 Phira 用戶名*/,
  "phira_rks": /*浮點數，用戶的 Phira rks*/,
  "phira_avatar": /*字串，用戶的 Phira 頭像連結*/,
  "register_time": /*時間字串，用戶註冊時間*/,
  "last_login_time": /*時間字串，用戶上次登入時間*/,
  "last_sync_time": /*時間字串，用戶上次同步 Phira 帳號資料時間*/ 
}
```

---

#### `POST /api/auth/users`

**說明**：創建用戶

**請求資料格式**：

```json
{
  "group_id": /*整數，可選，用戶所在組 ID，預設值為 3（user 組）*/,
  "username": /*字串，用戶名*/,
  "phira_id_or_username": /*字串，用戶試圖綁定的 Phira 帳號 ID（字串形式）或者 Phira 用戶名*/,
  "password": /*字串，用戶密碼*/
}
```

**響應資料格式**：返回一個 SSE 事件流，格式為下面之一：

* ```
  event: validating
  data: <一個字串，表示驗證所用的 token>
  ```

  **說明**：這個事件恰好在進行請求後發送一次，之後用戶需在 5min 內用試圖綁定的 Phira 帳號創建名稱是 token 的房間來完成驗證。

* ```
  event: timeout
  ```

  **說明**：在超時後發送，之後流關閉。

* ```
  event: success
  data: <一個 JSON 格式字串，與 /api/auth/me 格式相同，表示新註冊的用戶資訊>
  ```

  **說明**：在驗證成功後發送，之後流關閉。

* ```
  event: error
  data: <一個字串，表示錯誤資訊>
  ```

  **說明**：發生服務端錯誤時發送，之後流關閉。

* ```
  : heartbeat
  ```

  **說明**：用於檢測客戶端是否存活，無實際意義，瀏覽器一般會忽略。

**特殊說明**：若指定了 `group_id` 字段，則要求請求者擁有 `GROUP_MANAGEMENT` 權限。

---

#### `GET /api/auth/users`

**說明**：取得用戶列表

**響應資料格式**：

```json
[
  { /*每項為一個符合 /api/auth/me 響應格式的 object*/ }
]
```

---

#### `GET /api/auth/users/<int:id>`

**說明**：取得用戶 ID 為 `id` 的用戶資訊

**響應資料格式**：一個符合 `/api/auth/me` 響應格式的 object

---

#### `PATCH /api/auth/users/<int:id>`

**說明**：修改用戶 ID 為 `id` 的用戶資訊

**請求資料格式**：

```json
{
  "current_password": /*字串，請求者帳戶的當前密碼*/,
  "group_id": /*整數，可選，用戶所在組 ID，預設值為 3（user 組）*/,
  "username": /*字串，可選，用戶名*/,
  "phira_id": /*整數，可選，用戶的綁定的 Phira 帳號 ID*/,
  "password": /*字串，可選，用戶密碼*/
}
```

**返回資料格式**：修改後的用戶資訊，格式見 `/api/auth/me`。

---

#### `DELETE /api/auth/users/<int:id>`

**說明**：刪除用戶 ID 為 `id` 的用戶

**響應資料格式**：

```json
{
  "message": "success"
}
```

---

#### `GET /api/auth/groups`

**說明**：取得用戶組列表

**響應資料格式**：

```json
[
  {
    "id": /*整數，用戶組 ID*/,
    "name": /*字串，用戶組名稱*/,
    "permissions": /*整數，用戶組的位掩碼值*/
  },
  /*每項為一個符合以上格式的 object*/
]
```

---

#### `POST /api/auth/groups`

**說明**：創建用戶組

**請求資料格式**：

```json
{
  "name": /*字串，用戶組名稱*/,
  "permissions": /*整數，用戶組權限*/
}
```

**特殊說明**：需要 `GROUP_MANAGEMENT` 權限

---

#### `GET /api/auth/groups/<int:id>`

**說明**：取得用戶組 ID 為 `id` 的用戶組資訊

**響應資料格式**：一個符合 `/api/auth/groups` 每一項格式的 object

---

#### `PATCH /api/auth/groups/<int:id>`

**說明**：修改用戶組 ID 為 `id` 的用戶組資訊

**請求資料格式**：

```json
{
  "current_password": /*字串，請求者用戶的當前密碼*/,
  "name": /*字串，用戶組名稱*/,
  "permissions": /*整數，用戶組權限*/
}
```

**響應資料格式**：修改後的組資訊，格式見 `/api/auth/groups` 每一項

---

#### `DELETE /api/auth/groups/<int:id>`

**說明**：刪除用戶組 ID 為 `id` 的用戶組

**響應資料格式**：

```json
{
  "message": "success"
}
```

---

#### `GET /api/auth/visited`

**說明**：取得曾經使用過伺服器的 Phira 用戶列表

**響應資料格式**：

```json
[
  {
    "phira_id": /*整數，用戶的 Phira ID*/
  },
  /*每項為符合以上格式的 object*/
]
```

---

#### `GET /api/auth/visited/count`

**說明**：取得曾經使用過伺服器的 Phira 用戶數量

**響應資料格式**：

```json
/*整數，表示用戶數量*/
```

### 房間管理 api

#### `GET /api/rooms/info`

**說明**：取得房間列表

**響應資料格式**：

```json
[
  {
    "name": /*字串，房間名稱*/,
    "data": { // 房間資料
      "host": /*整數，房間 host 的 Phira ID*/,
      "users": /*列表，包含房間內所有用戶 Phira ID*/,
      "lock": /*布林值，房間是否為 lock*/,
      "cycle": /*布林值，房間是否為 cycle*/,
      "chart": /*整數或 null，房間當前選擇的鋪面 ID*/,
      "state": /*字串，SELECTING_CHART 或 WAITING_FOR_READY 或 PLAYING*/,
      "playing_users": /*列表，包含還在進行遊戲的用戶 ID*/,
      "rounds": [ // 房間已經進行過的所有輪遊戲的資訊
        {
          "chart": /*整數，該輪鋪面 ID*/,
          "records": [ // 該輪玩家成績資訊
            {
              "id": /*整數，記錄 ID*/,
              "player": /*整數，玩家 ID*/,
              "score": /*整數，分數*/,
              "perfect": /*整數，perfect 數量*/,
              "good": /*整數，good 數量*/,
              "bad": /*整數，bad 數量*/,
              "miss": /*整數，miss 數量*/,
              "max_combo": /*整數，max combo 數*/,
              "accuracy": /*浮點數，精準度*/,
              "full_combo": /*布林值，是否 full combo*/,
              "std": /*浮點數，無暇度*/,
              "std_score": /*浮點數，無暇度分數*/
            },
            /*每項為一個符合以上格式的 object*/
          ]
        },
        /*每項為一個符合以上格式的 object*/
      ],
    }
  },
  /*每項為一個符合以上格式的 object*/
]
```

---

#### `GET /api/rooms/info/<string:name>`

**說明**：取得房間名稱為 `name` 的房間資訊

**響應資料格式**：一個符合 `/api/rooms/info` 每一項格式的 object

---

#### `GET /api/rooms/user/<int:user_id>`

**說明**：取得用戶 ID 為 `user_id` 的用戶所在房間資訊

**響應資料格式**：一個符合 `/api/rooms/info/<string:name>` 響應格式的 object

---

#### `GET /api/rooms/listen`

**說明**：監聽房間資訊更新

**響應資料格式**：一個 SSE 事件流，每個事件的格式如下：

```json
event: /*字串，事件類型*/
data: /*字串，可解析為一個 json object*/
```

**特殊說明**：此介面使用 Server-Sent Events（SSE）協議，客戶端需要支援 SSE。不同事件類型如下：

| 事件類型       | 資料格式                                                     | 說明           |
| -------------- | ------------------------------------------------------------ | -------------- |
| `create_room`  | `{"room": /*字串，房間名*/, "data": /*房間資料，格式見上文*/}` | 新房間         |
| `update_room`  | `{"room": /*字串，房間名*/, "data": /*部分房間資料*/}`     | 房間資料更新   |
| `join_room`    | `{"room": /*字串，房間名*/, "user": /*整數，用戶 Phira ID*/}` | 用戶加入房間   |
| `leave_room`   | `{"room": /*字串，房間名*/, "user": /*整數，用戶 Phira ID*/}` | 用戶離開房間   |
| `player_score` | `{"room": /*字串，房間名*/, "record": /*記錄資料，格式見上文*/}` | 玩家完成遊戲   |
| `start_round`  | `{"room": /*字串，房間名*/}`                               | 房間開始新一輪 |
