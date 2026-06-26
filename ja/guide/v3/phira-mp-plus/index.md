# Phira-mp +

[Phira-mp +](https://github.com/HyperSynapseNetwork/Phira-mp-plus) は [phira-mp](https://github.com/HyperSynapseNetwork/phira-mp) を拡張した Phira マルチプレイヤーゲームサーバーで、WASM プラグイン、管理コンソール、HTTP API、監視データストリームを提供します。

## コア機能

- **WASM プラグインシステム** — wasmtime ベースの動的ロード、`phira:host/api` を介してサーバーの全機能にアクセス可能
- **TUI 管理コンソール** — `ratatui` + `crossterm` ベースのターミナルインターフェース、コマンド入力、リアルタイムログ表示をサポート
- **内蔵機能** — ルーム情報 Web API、ブラックリスト管理、ラウンドデータ永続化、レート制限などがコアに統合

## 技術スタック

| 技術 | 用途 |
|------|------|
| Rust | メイン開発言語（2021 Edition） |
| Tokio | 非同期ランタイム |
| ratatui + crossterm | TUI ターミナルインターフェース |
| Clap | CLI パラメータ解析 |
| Axum | HTTP/SSE サーバー |
| wasmtime | WASM ランタイム（オプション） |
| fluent | ローカライゼーション (i18n) |
| reqwest | HTTP クライアント |
| tracing | ログと診断 |

## クイックスタート

```bash
# Rust のインストール/更新
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable

# リポジトリのクローン
git clone https://github.com/HyperSynapseNetwork/Phira-mp-plus.git
cd Phira-mp-plus

# ビルド（初回コンパイルは約 2-5 分）
cargo build

# 起動（debug モード）
./target/debug/phira-mp-plus-server

# 設定ファイルを指定
./target/debug/phira-mp-plus-server --config my_config.yml
```

## ドキュメント

- [CLI コマンドリファレンス](/guide/v3/phira-mp-plus/cli) — 起動パラメータと対話型コマンド
- [API ドキュメント](/guide/v3/phira-mp-plus/api) — HTTP API と SSE エンドポイント
- [WASM プラグイン開発](/guide/v3/phira-mp-plus/plugin-dev) — プラグイン開発ガイド

## ライセンス

AGPLv3
