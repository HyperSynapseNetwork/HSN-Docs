# cpp-phira-mp

✨[phira-mp](https://github.com/TeamFlos/phira-mp) をベースに再開発された C++ 版 phira-mp です。Web 管理パネル、REST API、SSE リアルタイムイベント、BAN システム、観戦システム対応、接続ウェルカムメッセージを新たに追加しました。✨

## 特徴

### 1. 管理 Web パネル（パスワード保護付き）
- ブラウザから `http://サーバーIP:12347/admin` にアクセス（デフォルト）
- **ログイン認証**：初回実行時のデフォルトパスワードは `admin`、すぐに変更してください
- 全ルーム一覧、ルーム状態、プレイヤー数とその一覧を表示
- リアルタイム更新（5秒ごとに自動更新）
- 任意のルームをワンクリックで解散
- ルーム内の任意のプレイヤーをワンクリックでキック
- プレイヤー ID の BAN/解除（BAN 後、接続時に「あなたはBANされています」と表示）
- BAN リストは `banned_users.json` に永続的に保存

### 2. API

| エンドポイント | 説明 |
|------|------|
| `GET /api/rooms/info` | 全ルーム一覧と完全なデータを取得 |
| `GET /api/rooms/info/<n>` | 指定した名前のルーム情報を取得 |
| `GET /api/rooms/user/<user_id>` | 指定ユーザーの所属ルーム情報を取得 |
| `GET /api/rooms/listen` | SSE リアルタイムイベントストリーム |

#### SSE イベントタイプ
| イベント | 説明 |
|------|------|
| `keepalive` | 接続維持 |
| `create_room` | 新規ルーム作成 |
| `update_room` | ルームデータ更新（状態、譜面、ロック、交代などの変更） |
| `join_room` | ユーザーがルームに参加 |
| `leave_room` | ユーザーがルームから退出 |
| `player_score` | プレイヤーがゲームを完了（完全な成績記録を含む） |
| `start_round` | ルームが新ラウンドを開始 |

SSE 接続には 15 秒間隔のキープアライブ機構が組み込まれており、ミドルウェアやファイアウォールによる接続切断を防止します。

### 3. 本プログラムは [Phira観戦実装](https://github.com/HyperSynapseNetwork/phira-web-monitor) と組み合わせて観戦することができます。

### 4. 接続ウェルカムメッセージ
- ユーザー認証成功後に自動的にウェルカムメッセージを送信
- 現在参加可能なルーム一覧を表示（譜面選択中かつロックされていないルームのみ表示）

---

## コンパイル前の準備

```bash
# パッケージ一覧を更新
sudo apt update

# コンパイルツールと依存関係をインストール
sudo apt install -y build-essential g++ curl pkg-config uuid-dev libsqlite3-dev zlib1g-dev libssl-dev libboost-dev libspdlog-dev libargon2-dev libfmt-dev nlohmann-json3-dev libcurl4-openssl-dev make
```

### 必要な依存関係一覧
| 依存関係 | Ubuntu パッケージ名 | 用途 |
|------|------------|------|
| G++ (>=10) | `build-essential` / `g++` | C++20 コンパイラー |
| uuid-dev | `uuid-dev` | UUID 生成 |
| curl | `curl` | HTTP リクエスト（Phira API データ取得） |
| make | `build-essential` | ビルドツール |
| pkg-config | `pkg-config` | ビルドツール |
| Boost | `libboost-dev` | 必要な依存関係 |
| spdlog | `libspdlog-dev` | ログレベル実装 |
| Argon2 | `libargon2-dev` | バイナリプロトコル |
| Json3 | `nlohmann-json3-dev` | JSON3 |
| SQLite3 | `libsqlite3-dev` | ユーザーIDデータベース実装 |
| Curl-OpenSSL | `libcurl4-openssl-dev` | Curl と OpenSSL 実装 |
| OpenSSL | `libssl-dev` | SSL サポート |

---

## コンパイル

```bash
cd cpp-phira-mp
make clean
make -j$(nproc)
```

コンパイル成功後に `phira-mp-server` 実行ファイルが生成されます。

---

## ダウンロード

本プロジェクトの [GitHub Actions](https://github.com/HyperSynapseNetwork/cpp-phira-mp/actions) から、あらかじめコンパイルされた実行可能な `exe` と起動スクリプトをダウンロードできます。（`./start.sh` を入力して実行）。

---

## 実行

```bash
# デフォルトポートで実行（デフォルト：ゲームポート 12346、Web/api ポート 12347、管理パスワード admin）
./phira-mp-server

# カスタムポート
./phira-mp-server --port 12346 --http-port 12347 --admin-password PASSWORD

```

### コマンドライン引数
| 引数 | 説明 | デフォルト値 |
|------|------|--------|
| `--port` | ゲームサーバーポート | 12346 |
| `--http-port` | Web 管理/API ポート | 12347 |
| `--admin-password` | 管理パスワード | admin |
| `--db-path` | データベース`.db`ファイルのパス | visitors.db |
| `-h, --help` | ヘルプを表示 | - |

---

## ファイル構造

```
cpp-phira-mp-main/
├── include/
│   ├── binary.hpp          # バイナリプロトコル
│   ├── command.hpp         # コマンド定義
│   ├── http_server.hpp     # HTTP サーバー
│   ├── l10n.hpp            # ローカライゼーション
│   ├── room.hpp            # ルーム + ラウンド履歴
│   ├── server.hpp          # サーバー + get_state()
│   ├── session.hpp         # セッション
│   ├── stream.hpp          # タッチ情報ストリーム
│   ├── visitor_db.hpp      # 訪問者数記録
├── src/
│   ├── binary.cpp          # バイナリプロトコル実装
│   ├── command.cpp         # コマンド実装
│   ├── http_server.cpp     # Webページ/API実装
│   ├── l10n.cpp            # ローカライゼーション実装
│   ├── main.cpp            # メインエントリー
│   ├── room.cpp            # メインロジック実装
│   ├── server.cpp          # サーバー
│   ├── session.cpp         # メインロジック実装
    ├── visitor_db.cpp      # 訪問者数記録
│   └── stream.cpp          # 観戦プロトコル
│   
├── locales/
│   ├── en-US.ftl
│   ├── zh-CN.ftl
│   └── zh-TW.ftl
├── Makefile
├── CMakeLists.txt
└── README.md
```

### 実行時ファイル
- `banned_user.json` — BAN されたプレイヤー ID リスト（自動作成/管理）

---

## API 使用例

```bash
# 全ルームを取得
curl http://localhost:12345/api/rooms/info

# 指定ルームを取得
curl http://localhost:12345/api/rooms/info/my-room

# ユーザーの所属ルームを取得
curl http://localhost:12345/api/rooms/user/12345

# リアルタイムイベントを監視（SSE）
curl http://localhost:12345/api/rooms/listen

```

---

## QQ グループ

**1049578201**

## ライセンス

**MIT** ライセンスを使用しています。
