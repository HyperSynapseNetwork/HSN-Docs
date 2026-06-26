# HSNBot

HSNBot は [NoneBot2](https://nonebot.dev/) + [OneBot V11](https://onebot.adapters.nonebot.dev/) ベースの QQ グループボットで、Phira マルチプレイルーム検索、サーバー監視、データ統計などの機能を提供します。

## 技術スタック

| コンポーネント | 技術 |
|------|------|
| フレームワーク | NoneBot2 |
| プロトコルアダプター | OneBot V11 |
| コマンドシステム | Alconna |
| HTTP クライアント | httpx / aiohttp |
| 画像レンダリング | nonebot-plugin-htmlrender (Playwright / Chromium) |
| データソース API | HSN バックエンド監視サービス (`http://23.141.172.246:7001`) |

## 機能一覧

### サーバーステータス

| コマンド | 説明 | ファイル |
|------|------|------|
| `/cksvr` | CK ゲームサーバーがオンラインか確認 | `ckmp.py` |
| `/mcstatus` | Minecraft サーバーステータスを照会し画像としてレンダリング | `mccheck.py` |
| `/users` / `オンライン人数` | Phira サーバーの現在のオンラインプレイヤー数を取得 | `users.py` |

### ルーム管理

| コマンド | 説明 | ファイル |
|------|------|------|
| `/room` | 現在の全ルームを照会（画像） | `room.py` |
| `/room record <ルーム名>` | 指定ルームのプレイ記録を照会 | `room.py` |

プラグインは SSE を介してバックエンドをリアルタイムで監視し、新規ルーム作成時に画像通知を設定された QQ グループに自動プッシュします。

### データ監視

| コマンド | 説明 | ファイル |
|------|------|------|
| `/hsndata health` | 監視 API の健全性を確認 | `hsndata.py` |
| `/hsndata history [開始] [終了]` | HSN 履歴オンラインデータを取得 | `hsndata.py` |
| `/hsndata chart <開始> <終了>` | 指定期間のオンライン傾向チャートを生成 | `hsndata.py` |
| `/hsndata charts` | 生成済みの全チャートを一覧表示 | `hsndata.py` |
| `/hsndata image <タイプ>` | チャート画像を取得（hsn / room / user_bar / user_pie） | `hsndata.py` |
| `/hsndata roomrank` | ルーム使用回数ランキング | `hsndata.py` |
| `/hsndata userrank [ユーザーID]` | ユーザープレイ時間ランキングまたは指定ユーザー照会 | `hsndata.py` |
| `/hsndata leaderboard [数量]` | プレイ時間ランキングを取得 | `hsndata.py` |
| `/hsndata generate` | 手動でチャート生成をトリガー | `hsndata.py` |
| `/hsnvs latest` | 最新のサーバー比較データとトレンドチャートを取得 | `hsnvs.py` |
| `/hsnvs history <分数>` | 指定分前のデータを取得 | `hsnvs.py` |
| `/hsnvs stats` | 統計結果を取得 | `hsnvs.py` |
| `/hsnvs config show \| update` | 設定を表示または更新 | `hsnvs.py` |

### その他

| コマンド | 説明 | ファイル |
|------|------|------|
| `/setu [キーワード]` | Lolicon API 経由で画像を取得、10秒後に自動撤回 | `setu.py` |
| `罵人` / `fuck` / `吃大糞` | 面白い返信 | `maren.py` |
| `/restart [api]` | Phira サーバーを再起動（グループ owner/管理者のみ） | `restart.py` |

## 設定

`.env` または `.env.prod` で設定：

```env
# Phira ルームプラグイン
PHIRA_API_BASE=http://23.141.172.246:12345
PHIRA_CHART_API=https://phira.5wyxi.com
PHIRA_NOTIFY_GROUPS=[123456789, 987654321]
PHIRA_FONT_PATH=/path/to/font.ttf
PHIRA_BG_PATH=/path/to/background.jpg
PHIRA_LOGO_PATH=/path/to/logo.png
PHIRA_CACHE_TTL=600
PHIRA_SSE_RETRY=5
PHIRA_IMAGE_QUALITY=90

# CK サーバーチェッカー（ckmp.py で直接変更）
# USERNAME="your-email"
# PASSWORD="your-password"

# HSN データ監視
HSN_API_BASE=http://23.141.172.246:7001
```

## デプロイ

```bash
# 依存関係をインストール
pip install nonebot2 nonebot-adapter-onebot nonebot-plugin-alconna nonebot-plugin-htmlrender
pip install httpx aiohttp mcstatus

# .env を設定
echo "DRIVER=~fastapi+~httpx" >> .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8080" >> .env

# 起動
nb run
```
