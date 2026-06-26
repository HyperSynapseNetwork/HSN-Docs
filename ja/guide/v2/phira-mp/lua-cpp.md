Lua/Cpp Phira-mp はメンテナンスを終了しました。[Phira-mp-plus](https://github.com/HyperSynapseNetwork/Phira-mp-plus/) に移行してください。

# Lua/Cpp Phira-mp

C++20 で実装された、完全で高機能なマルチプレイヤーゲームサーバーです。phira-mp プロトコルと完全な互換性を持ち、強力な Lua プラグインシステムと RESTful HTTP API によって拡張されています。

## 📋 機能特性

### コアサーバー
- **バイナリプロトコル対応** - 16 のコマンドタイプを持つ phira-mp バイナリコマンドプロトコルの完全実装
- **マルチスレッドアーキテクチャ** - 専用接続スレッドによる効率的なセッション処理
- **ルーム管理** - 作成、参加、管理機能を備えた完全なルームシステム
- **ユーザーセッション管理** - UUID ベースの識別による堅牢なユーザー接続処理

### プラグインシステム
- **Lua 5.4 統合** - Lua スクリプティングをサポートする動的プラグインローディング
- **イベントフック** - 包括的なフックシステム（`on_enable`、`on_disable`、`on_user_join`、`on_before_command` など）
- **プラグイン API** - グローバル `phira` テーブルを介して公開される完全な Lua API
- **ホットリロード** - プラグインの実行時有効化/無効化

### HTTP API
- **RESTful エンドポイント** - ポート 61234（設定可能）での完全な HTTP API
- **公開エンドポイント** - クライアントアプリケーション向けの `/room`、`/stats`
- **リプレイシステム** - リプレイ認証と取得のための `/replay/*` エンドポイント
- **管理インターフェース** - HTTP 経由の完全な管理制御（`/admin/*`）
- **CORS サポート** - Web クライアント向けのクロスオリジンリクエスト対応

### リプレイシステム
- **録画と保存** - ゲームプレイ中の自動リプレイ録画
- **ファイルベース保存** - リプレイは `replays/` ディレクトリにバイナリファイルとして保存
- **メタデータ管理** - リプレイ情報の追跡（プレイヤー、楽曲、タイムスタンプ、サイズ）
- **HTTP アクセス** - 認証付き HTTP エンドポイントを介したリプレイへのアクセス

### 管理機能
- **トークンベース認証** - シンプルな管理トークンシステム（HSN 統合待ち）
- **サーバー設定** - HTTP API による動的設定
- **ルーム制御** - ルームの作成、BAN、管理
- **ユーザー管理** - ユーザーの BAN、切断、監視
- **ブロードキャストシステム** - サーバー全体へのメッセージブロードキャスト

### 対話型 CLI
- **リアルタイムコマンド入力** - サーバー管理のための対話型コンソール
- **サーバーステータス監視** - 接続ユーザー数、アクティブルーム、サーバー統計の表示
- **ルーム管理** - ルームの一覧表示、解散、直接設定
- **ユーザー管理** - キック、BAN、BAN解除、ユーザー詳細の表示
- **プラグイン制御** - サーバー再起動なしでのプラグインのホットリロード
- **ブロードキャストメッセージ** - 全ルームまたは特定ルームへのメッセージ送信

## クイックスタート

### 環境要件
- **g++ 13+**（C++20 サポート）
- **Lua 5.4** 開発ライブラリ
- **libuuid**（UUID 生成用）
- **pthread**（スレッドサポート用）

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y g++ make liblua5.4-dev uuid-dev
```

**CentOS/RHEL:**
```bash
sudo yum install -y gcc-c++ make lua-devel libuuid-devel
```

### コンパイル
```bash
# リポジトリをクローン（未クローンの場合）
git clone <repository-url>
cd cpp-phira-mp

# サーバーをビルド
make clean
make
```

これにより `phira-mp-server` バイナリが生成されます。

### 実行
```bash
# デフォルトポートで起動（12346 がゲームプロトコル、61234 が HTTP）
./phira-mp-server

# カスタムゲームポートで起動
./phira-mp-server --port 8080

# バックグラウンドで起動
nohup ./phira-mp-server > server.log 2>&1 &
```

サーバーは以下の処理を実行します：
1. `server_config.yml` から設定を読み込み（存在する場合）
2. `plugins/` ディレクトリからプラグインをスキャンしてロード
3. 指定ポート（デフォルト：12346）でゲームサーバーを起動
4. ポート 61234 で HTTP API サーバーを起動
5. 対話型 CLI を起動（コンソール管理用）
6. 接続の受け入れを開始

### 対話型 CLI の使用

サーバーを起動すると、CLI プロンプトが表示されます：
```
=== Phira MP Server CLI ===
Type 'help' for available commands
==============================

> 
```

#### 使用可能なコマンド

**一般コマンド：**
- `help`、`?` - ヘルプメッセージを表示
- `status`、`info` - サーバーステータスを表示
- `stop`、`shutdown` - シャットダウン手順を表示

**ルーム管理：**
- `list`、`rooms` - 全アクティブルームを一覧表示
- `disband <roomId>` - ルームを解散
- `maxusers <roomId> <count>` - ルームの最大ユーザー数を設定（1-64）
- `roomcreation <on|off|status>` - ルーム作成を制御

**ユーザー管理：**
- `users` - 全オンラインユーザーを一覧表示
- `user <userId>` - ユーザー詳細を表示
- `kick <userId>` - ユーザーをサーバーからキック
- `ban <userId>` - ユーザーをサーバーから BAN
- `unban <userId>` - ユーザーの BAN を解除
- `banlist` - BAN されたユーザーの一覧を表示

**通信：**
- `broadcast <msg>` - 全ルームにメッセージをブロードキャスト
- `say <msg>` - broadcast のエイリアス
- `roomsay <roomId> <msg>` - 特定のルームにメッセージを送信

**サーバー管理：**
- `reload` - 全プラグインをリロード
- `replay <on|off|status>` - リプレイ録画を制御

#### コマンド例

```bash
# サーバーステータスを表示
> status

# 全アクティブルームを一覧表示
> list

# 全オンラインユーザーを一覧表示
> users

# ユーザーをキック
> kick 12345

# サーバーメッセージをブロードキャスト
> broadcast Server will restart in 10 minutes

# 特定ルームにメッセージを送信
> roomsay room1 Please follow the game rules

# ルームを解散
> disband room1

# 全プラグインをリロード
> reload

# リプレイ録画を制御
> replay on
> replay status
```

**注意**：高度なコマンド（コンテストモード、IP ブラックリスト管理など）については、ポート 61234 の HTTP API を使用してください。

## 設定

### サーバー設定
作業ディレクトリに `server_config.yml` を作成：

```yaml
# ゲームサーバーポート
port: 12346

# HTTP API サーバーポート
http_port: 61234

# API アクセス用管理トークン（簡略版、HSN 統合待ち）
admin_token: "your-secure-admin-token-here"

# リプレイシステム有効化
replay_enabled: true

# ルーム作成有効化
room_creation_enabled: true

# モニター ID（ゲーム固有）
monitors:
  - 2
  - 42
```

設定ファイルが見つからない場合は、デフォルト値が使用されます。

### プラグイン設定
`plugins/` ディレクトリ内の各プラグインには以下が必要です：
- `plugin.json` - プラグインメタデータ（id、name、version、author、enabled フラグ）
- `init.lua` - メインプラグインスクリプト

`plugin.json` の例：
```json
{
    "id": "my-plugin",
    "name": "My Plugin",
    "version": "1.0.0",
    "description": "Plugin description",
    "author": "Your Name",
    "enabled": true,
    "dependencies": []
}
```

## プラグインシステム

### 内蔵プラグイン
サーバーには 5 つの内蔵プラグインが付属しています：

1. **http-admin-api** - HTTP Admin API エンドポイント
2. **replay-recorder** - ゲームリプレイの録画と管理
3. **admin-commands** - 管理コマンドシステム
4. **advanced-room-management** - 拡張ルーム制御と機能
5. **virtual-room** - 仮想ルームの作成と管理

### プラグイン開発
プラグインは Lua で記述され、グローバル `phira` テーブルを介してサーバーにアクセスします。

**完全なプラグイン開発ドキュメントについては、[PLUGIN_DEVELOPMENT.md](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/PLUGIN_DEVELOPMENT.md) を参照してください。**

プラグインシステムが提供する機能：
- **40 以上のサーバー管理 API** - ユーザー、ルーム、メッセージ、BAN、コンテスト、サーバー状態の完全制御
- **包括的なイベントフック** - ユーザーの参加/退出、ルームの作成/削除、キック、BAN、コマンドフィルタリングのリアルタイム通知
- **HTTP ルート登録** - カスタムエンドポイントによる HTTP API の拡張
- **スレッドセーフな操作** - すべての API は並行アクセスに対して適切に同期

#### 新しいイベントフック（v2.0+）
- `on_user_kick(user, room, reason)` - ユーザーがキックされた時
- `on_user_ban(user, reason, duration)` - ユーザーが BAN された時
- `on_user_unban(user_id)` - ユーザーの BAN が解除された時
- `on_room_create(room)` - ルームが作成された時
- `on_room_destroy(room)` - ルームが削除された時

#### 新しい管理 API（v2.0+）
```lua
-- ユーザー管理
phira.kick_user(user_id, preserve_room)
phira.ban_user(user_id)
phira.unban_user(user_id)
phira.is_user_banned(user_id)
phira.get_banned_users()

-- ルーム管理
phira.disband_room(room_id)
phira.set_max_users(room_id, max_users)
phira.get_room_max_users(room_id)

-- メッセージング
phira.broadcast_message(message)
phira.roomsay_message(room_id, message)

-- サーバー制御
phira.shutdown_server()
phira.reload_plugins()

-- 状態照会
phira.get_connected_user_count()
phira.get_active_room_count()
phira.get_room_list()

-- IP ブラックリスト管理
phira.add_ip_to_blacklist(ip, is_admin)
phira.remove_ip_from_blacklist(ip, is_admin)
phira.is_ip_banned(ip)

-- コンテスト管理
phira.enable_contest(room_id, manual_start, auto_disband)
phira.disable_contest(room_id)
phira.start_contest(room_id, force)
```

完全な API リファレンスと例については、[PLUGIN_DEVELOPMENT.md](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/PLUGIN_DEVELOPMENT.md) を参照してください。

## HTTP API リファレンス

### 公開エンドポイント

#### `GET /room`
利用可能な全ルームの一覧を取得します。

**レスポンス：**
```json
{
    "rooms": [
        {
            "id": "room-uuid",
            "name": "Room Name",
            "players": 3,
            "maxPlayers": 8,
            "status": "waiting"
        }
    ],
    "total": 1
}
```

#### `GET /stats`
サーバー統計を取得します。

**レスポンス：**
```json
{
    "users": 5,
    "sessions": 5,
    "rooms": 2,
    "uptime": 3600,
    "version": "1.0.0"
}
```

### リプレイエンドポイント

#### `POST /replay/auth`
リプレイアクセスのための認証（スタブ実装）。

**リクエスト：**
```json
{
    "token": "user-token"
}
```

**レスポンス：**
```json
{
    "ok": true,
    "userId": 12345,
    "charts": [],
    "sessionToken": "mock_session_token",
    "expiresAt": 1678886400
}
```

#### `GET /replay/download`
リプレイファイルをダウンロード（認証が必要）。

**クエリパラメータ：**
- `id` - リプレイ ID
- `token` - セッショントークン

#### `POST /replay/delete`
リプレイを削除（スタブ実装）。

### 管理エンドポイント
すべての管理エンドポイントは `admin_token` パラメータ（クエリ文字列またはリクエストボディ）による認証が必要です。

#### 認証方式
1. **クエリパラメータ**：`?admin_token=your-token`
2. **リクエストボディ**：`{"admin_token": "your-token"}`

#### 利用可能な管理エンドポイント

**設定管理：**
- `GET /admin/replay/config` - リプレイ設定を取得
- `POST /admin/replay/config` - リプレイ設定を更新
- `GET /admin/room-creation/config` - ルーム作成設定を取得
- `POST /admin/room-creation/config` - ルーム作成設定を更新

**ルーム管理：**
- `GET /admin/rooms` - 詳細付きで全ルームを一覧表示
- `POST /admin/ban/room` - ルームを BAN
- `POST /admin/rooms/max_users` - ルームの最大ユーザー数を設定
- `POST /admin/rooms/disband` - ルームを解散
- `POST /admin/rooms/chat` - ルームチャットメッセージを送信

**ユーザー管理：**
- `GET /admin/users/info` - ユーザー情報を取得
- `POST /admin/ban/user` - ユーザーを BAN
- `POST /admin/users/disconnect` - ユーザーを切断
- `POST /admin/users/move` - ユーザーを別のルームに移動

**サーバー制御：**
- `POST /admin/broadcast` - 全ユーザーにメッセージをブロードキャスト
- `GET /admin/ip-blacklist` - IP ブラックリストを取得
- `POST /admin/ip-blacklist/remove` - IP をブラックリストから削除
- `POST /admin/ip-blacklist/clear` - IP ブラックリストをクリア
- `GET /admin/log-rate` - ログレート設定を取得

**OTP エンドポイント（簡略版 - HSN 統合待ち）：**
- `POST /admin/otp/request` - OTP をリクエスト（ダミーセッションを返す）
- `POST /admin/otp/verify` - OTP を検証（テスト用に "123456" を受け付ける）

## 認証とセキュリティ

### 現在の実装
現在の認証システムは簡略化されており、HSN（HyperSynapseNetwork）統合ユーザーシステムとの統合を待っています。

**管理認証：**
- 設定内の単一 `admin_token`
- クエリパラメータまたはリクエストボディでトークンを渡す
- 現在の簡略版では OTP/IP BAN なし

**将来の HSN 統合：**
- サービス間での統合ユーザーアカウント
- OTP ベースの管理認証
- IP ベースのレート制限と BAN
- セッション管理

### セキュリティ上の注意
1. **本番環境**：現在の簡略認証は開発/テスト専用です
2. **トークンセキュリティ**：`admin_token` は安全に保管し、定期的にローテーションしてください
3. **ネットワークセキュリティ**：本番環境ではファイアウォール/リバースプロキシの背後で実行してください
4. **HTTPS**：本番環境ではリバースプロキシで HTTPS 終端を使用してください

## リプレイシステム

### 動作原理
1. **録画**：ゲームプレイ中、サーバーはゲームイベントを記録します
2. **保存**：リプレイは `replays/` ディレクトリにバイナリファイルとして保存されます
3. **メタデータ**：リプレイ情報はサーバーメモリに保存され、高速アクセスが可能です
4. **取得**：認証付き HTTP エンドポイントを介してリプレイにアクセスできます

### ファイル構造
```
replays/
├── replay_1234567890_1678886400.bin
├── replay_1234567891_1678886500.bin
└── ...
```

### リプレイ情報
各リプレイには以下が含まれます：
- 一意のリプレイ ID
- プレイヤー名
- 楽曲 ID
- 作成タイムスタンプ
- ファイルサイズ
- バイナリゲームデータ

## 開発

### ソースからのビルド
```bash
# リポジトリをクローン
git clone <repository-url>
cd cpp-phira-mp

# 依存関係をインストール（Ubuntu/Debian の例）
sudo apt-get install -y g++ make liblua5.4-dev uuid-dev

# ビルド
make

# テストを実行（利用可能な場合）
make test
```

### コード構造
```
cpp-phira-mp/
├── include/              # ヘッダーファイル
│   ├── server.h         # サーバーコア定義
│   ├── session.h        # セッション管理
│   ├── room.h           # ルームシステム
│   ├── commands.h       # バイナリプロトコルコマンド
│   ├── http_server.h    # HTTP サーバー
│   ├── lua_bindings.h   # Lua API バインディング
│   └── ...
├── src/                 # ソースファイル
│   ├── server.cpp       # サーバー実装
│   ├── session.cpp      # セッション処理
│   ├── http_server.cpp  # HTTP API 実装
│   ├── lua_bindings.cpp # Lua 統合
│   └── ...
├── plugins/             # Lua プラグイン
│   ├── http-admin-api/
│   ├── replay-recorder/
│   ├── admin-commands/
│   ├── advanced-room-management/
│   └── virtual-room/
├── replays/             # リプレイ保存
├── locales/             # ローカライゼーションファイル
├── Makefile             # ビルド設定
├── server_config.yml    # サーバー設定
└── README.md            # このファイル
```

### サーバーの拡張

#### 新しいコマンドの追加
1. `include/commands.h` でコマンドを定義
2. `src/session.cpp` で処理を実装
3. 必要に応じてプラグインフックを追加

#### HTTP エンドポイントの追加
1. `src/http_server.cpp` でルート登録を追加
2. ハンドラー関数を実装
3. curl または HTTP クライアントでテスト

#### 新しいプラグインの作成
1. `plugins/` にディレクトリを作成
2. メタデータを含む `plugin.json` を追加
3. プラグインロジックを含む `init.lua` を作成
4. 設定で有効化

## トラブルシューティング

### よくある問題

**サーバーが起動しない：**
- ポートの可用性を確認：`sudo lsof -i :12346`
- 依存関係を確認：`ldd phira-mp-server`
- 権限を確認：`chmod +x phira-mp-server`

**プラグインが読み込まれない：**
- プラグインディレクトリ構造を確認
- `plugin.json` の構文を確認
- 設定でプラグインを有効化
- Lua バージョンの互換性を確認

**HTTP API にアクセスできない：**
- HTTP サーバーがポート 61234 で実行中か確認
- ファイアウォールルールを確認
- ローカルでテスト：`curl http://localhost:61234/stats`

**メモリ使用量が多い：**
- プラグインのメモリリークを確認
- `top` または `htop` で監視
- 必要に応じて接続制限を調整

### ログ
サーバーは stdout にログを出力します。重要なイベントには以下が含まれます：
- サーバーの起動と停止
- ユーザーの接続/切断
- ルームの作成/削除
- プラグインの読み込み/有効化
- HTTP リクエスト処理

本番環境では、ログをファイルにリダイレクト：
```bash
./phira-mp-server > /var/log/phira-server.log 2>&1 &
```

## 貢献ガイド

### 開発プロセス
1. リポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを開く

### コード標準
- **C++20** とモダンなプラクティス
- リソース管理に **RAII**
- 該当箇所での **const-correctness**
- 変数/関数の**意味のある命名**
- 複雑なロジックへの**コメント**

### テスト
- 新しい機能を徹底的にテスト
- 後方互換性を確認
- 複数の同時クライアントでテスト
- HTTP API レスポンスを検証

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。詳細については [LICENSE](https://github.com/HyperSynapseNetwork/phira-mp/blob/main/LICENSE) ファイルを参照してください。

```
MIT License

Copyright (c) 2026 HyperSynapseNetwork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 謝辞

- **オリジナル phira-mp** - プロトコル仕様とインスピレーションに対して
- **Lua コミュニティ** - 強力なスクリプト言語に対して
- **オープンソースコントリビューター** - 様々なライブラリとツールに対して
- **HyperSynapseNetwork** - プロジェクトのスポンサーシップと開発に対して
- **tphira-mp** - 本プロジェクトに大量の参考情報（英語）を提供
- **jphira-mp** - 本プロジェクトに大量の参考情報（英語）を提供

---

**注意**：本サーバーは活発に開発中です。機能と API は開発の進捗に応じて変更される可能性があります。ご利用のバージョンに応じたドキュメントを常に参照してください。
