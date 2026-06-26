# HSH-Phira Backend Remake

## How to Run

### Development Environment

This project is managed using uv. Assuming you have cloned the (full) repository to the HSNPhira directory and have uv installed, execute the following commands in order:

```bash
# Enter the backend directory
cd HSNPhira/backend
# Install dependencies
uv sync
# Initialize the database (only run before the first server startup)
uv run flask seed_db
# Run
uv run flask run --debug --host=0.0.0.0 --port=5000
```

### Production Environment

Coo.

## API Documentation

### User Management API

#### User Permissions

This project implements permission management through user groups. Each group has a `permissions` attribute, which is a bitmask with the following values:

| Identifier          | Value         | Description                        |
| ------------------- | ------------- | ---------------------------------- |
| `NONE`              | `0`           | No permissions                     |
| `ALL`               | `0xffffffff`  | Has all permissions                |
| `IMPORT`            | `0x00000001`  | Indicates the user is an important user |
| `USER_MANAGEMENT`   | `0x00000002`  | Has user management permissions    |
| `GROUP_MANAGEMENT`  | `0x00000004`  | Has user group management permissions |

On initialization, one user and three user groups are created:

| Username | User ID | User's Group |
| -------- | ------- | ------------ |
| root     | 1       | super_admin  |

| Group Name | Group ID | Permissions                      |
| ---------- | -------- | -------------------------------- |
| root       | 1        | `ALL`                            |
| admin      | 2        | `IMPORTANT`, `USER_MANAGEMENT`   |
| user       | 3        | `NONE`                           |

---

#### `POST /api/auth/login`

**Description**: Log in a user

**Request Data Format**:

```json
{
  "username": /*string, username*/,
  "password": /*string, password*/,
  "remember": /*boolean, whether to remember the user*/
}
```

**Response Data Format**: Logged-in user info, format as in `/api/auth/me`.

---

#### `POST /api/auth/logout`

**Description**: Log out a user

---

#### `GET /api/auth/me`

**Description**: Get current user info

**Response Data Format**:

```json
{
  "id": /*integer, user ID*/,
  "group_id": /*integer, user's group ID*/,
  "username": /*string, username*/,
  "phira_id": /*integer, user's linked Phira account ID*/,
  "phira_username": /*string, user's Phira username*/,
  "phira_rks": /*float, user's Phira rks*/,
  "phira_avatar": /*string, user's Phira avatar URL*/,
  "register_time": /*time string, user registration time*/,
  "last_login_time": /*time string, user's last login time*/,
  "last_sync_time": /*time string, user's last Phira account data sync time*/
}
```

---

#### `POST /api/auth/users`

**Description**: Create a user

**Request Data Format**:

```json
{
  "group_id": /*integer, optional, user's group ID, default is 3 (user group)*/,
  "username": /*string, username*/,
  "phira_id_or_username": /*string, the Phira account ID (as string) or Phira username the user wants to link*/,
  "password": /*string, user password*/
}
```

**Response Data Format**: Returns an SSE event stream, with one of the following formats:

* ```
  event: validating
  data: <a string, the token used for verification>
  ```

  **Description**: This event is sent once immediately after the request is made. The user must create a room with the token as the name using the Phira account they wish to link within 5 minutes to complete verification.

* ```
  event: timeout
  ```

  **Description**: Sent after timeout, then the stream closes.

* ```
  event: success
  data: <a JSON format string, same format as /api/auth/me, indicating new user registration info>
  ```

  **Description**: Sent after successful verification, then the stream closes.

* ```
  event: error
  data: <a string, error message>
  ```

  **Description**: Sent when a server error occurs, then the stream closes.

* ```
  : heartbeat
  ```

  **Description**: Used to check if the client is alive; no practical meaning, browsers usually ignore it.

**Special Note**: If the `group_id` field is specified, the requester must have `GROUP_MANAGEMENT` permission.

---

#### `GET /api/auth/users`

**Description**: Get user list

**Response Data Format**:

```json
[
  { /*each item is an object matching the /api/auth/me response format*/ }
]
```

---

#### `GET /api/auth/users/<int:id>`

**Description**: Get info for user with ID `id`

**Response Data Format**: An object matching the `/api/auth/me` response format

---

#### `PATCH /api/auth/users/<int:id>`

**Description**: Modify info for user with ID `id`

**Request Data Format**:

```json
{
  "current_password": /*string, current password of the requester's account*/,
  "group_id": /*integer, optional, user's group ID, default is 3 (user group)*/,
  "username": /*string, optional, username*/,
  "phira_id": /*integer, optional, user's linked Phira account ID*/,
  "password": /*string, optional, user password*/
}
```

**Response Data Format**: Modified user info, format as in `/api/auth/me`.

---

#### `DELETE /api/auth/users/<int:id>`

**Description**: Delete user with ID `id`

**Response Data Format**:

```json
{
  "message": "success"
}
```

---

#### `GET /api/auth/groups`

**Description**: Get user group list

**Response Data Format**:

```json
[
  {
    "id": /*integer, user group ID*/,
    "name": /*string, user group name*/,
    "permissions": /*integer, user group bitmask value*/
  },
  /*each item is an object matching the above format*/
]
```

---

#### `POST /api/auth/groups`

**Description**: Create a user group

**Request Data Format**:

```json
{
  "name": /*string, user group name*/,
  "permissions": /*integer, user group permissions*/
}
```

**Special Note**: Requires `GROUP_MANAGEMENT` permission

---

#### `GET /api/auth/groups/<int:id>`

**Description**: Get info for user group with ID `id`

**Response Data Format**: An object matching each item format of `/api/auth/groups`

---

#### `PATCH /api/auth/groups/<int:id>`

**Description**: Modify info for user group with ID `id`

**Request Data Format**:

```json
{
  "current_password": /*string, current password of the requester user*/,
  "name": /*string, user group name*/,
  "permissions": /*integer, user group permissions*/
}
```

**Response Data Format**: Modified group info, format as in each item of `/api/auth/groups`

---

#### `DELETE /api/auth/groups/<int:id>`

**Description**: Delete user group with ID `id`

**Response Data Format**:

```json
{
  "message": "success"
}
```

---

#### `GET /api/auth/visited`

**Description**: Get list of Phira users who have used the server

**Response Data Format**:

```json
[
  {
    "phira_id": /*integer, user's Phira ID*/
  },
  /*each item is an object matching the above format*/
]
```

---

#### `GET /api/auth/visited/count`

**Description**: Get the count of Phira users who have used the server

**Response Data Format**:

```json
/*integer, number of users*/
```

### Room Management API

#### `GET /api/rooms/info`

**Description**: Get room list

**Response Data Format**:

```json
[
  {
    "name": /*string, room name*/,
    "data": { // Room data
      "host": /*integer, room host's Phira ID*/,
      "users": /*list, contains Phira IDs of all users in the room*/,
      "lock": /*boolean, whether the room is locked*/,
      "cycle": /*boolean, whether the room is in cycle mode*/,
      "chart": /*integer or null, currently selected chart ID*/,
      "state": /*string, SELECTING_CHART or WAITING_FOR_READY or PLAYING*/,
      "playing_users": /*list, contains user IDs still playing*/,
      "rounds": [ // Information for all rounds that have been played in the room
        {
          "chart": /*integer, chart ID for this round*/,
          "records": [ // Player score info for this round
            {
              "id": /*integer, record ID*/,
              "player": /*integer, player ID*/,
              "score": /*integer, score*/,
              "perfect": /*integer, perfect count*/,
              "good": /*integer, good count*/,
              "bad": /*integer, bad count*/,
              "miss": /*integer, miss count*/,
              "max_combo": /*integer, max combo count*/,
              "accuracy": /*float, accuracy*/,
              "full_combo": /*boolean, whether full combo*/,
              "std": /*float, std*/,
              "std_score": /*float, std score*/
            },
            /*each item is an object matching the above format*/
          ]
        },
        /*each item is an object matching the above format*/
      ],
    }
  },
  /*each item is an object matching the above format*/
]
```

---

#### `GET /api/rooms/info/<string:name>`

**Description**: Get info for room named `name`

**Response Data Format**: An object matching each item format of `/api/rooms/info`

---

#### `GET /api/rooms/user/<int:user_id>`

**Description**: Get room info for the room where user with ID `user_id` is currently located

**Response Data Format**: An object matching the response format of `/api/rooms/info/<string:name>`

---

#### `GET /api/rooms/listen`

**Description**: Listen for room info updates

**Response Data Format**: An SSE event stream, with each event formatted as:

```json
event: /*string, event type*/
data: /*string, parseable as a JSON object*/
```

**Special Note**: This endpoint uses the Server-Sent Events (SSE) protocol. The client must support SSE. The different event types are:

| Event Type      | Data Format                                                    | Description            |
| --------------- | -------------------------------------------------------------- | ---------------------- |
| `create_room`   | `{"room": /*string, room name*/, "data": /*room data, format as above*/}` | New room               |
| `update_room`   | `{"room": /*string, room name*/, "data": /*partial room data*/}`         | Room data update       |
| `join_room`     | `{"room": /*string, room name*/, "user": /*integer, user Phira ID*/}`   | User joins room        |
| `leave_room`    | `{"room": /*string, room name*/, "user": /*integer, user Phira ID*/}`   | User leaves room       |
| `player_score`  | `{"room": /*string, room name*/, "record": /*record data, format as above*/}` | Player finishes game   |
| `start_round`   | `{"room": /*string, room name*/}`                              | Room starts new round  |
