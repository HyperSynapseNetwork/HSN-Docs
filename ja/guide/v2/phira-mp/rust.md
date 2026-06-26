# phira-mp

`phira-mp` は Rust で開発されたプロジェクトです。以下はサーバーサイドをデプロイして実行する手順です。

[English Version](https://github.com/HyperSynapseNetwork/phira-mp#readme)

## 環境

- Rust 1.70 以上

## サーバーインストール

### `Linux` ユーザーの場合

#### 依存関係

まず、Rust がインストールされていない場合はインストールしてください。https://www.rust-lang.org/tools/install の手順に従ってください。

Ubuntu または Debian ユーザーで `curl` がインストールされていない場合は、次のコマンドでインストールしてください：

```shell
sudo apt install curl
```

Fedora または CentOS ユーザーは次のコマンドを使用してください：

```shell
sudo yum install curl
```

curl のインストール後、次のコマンドで Rust をインストールします：

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

その後、プロジェクトをビルドします：

```shell
cargo build --release -p phira-mp-server
```

#### サーバーの実行

次のコマンドでアプリケーションを実行できます：

```shell
RUST_LOG=info target/release/phira-mp-server
```

パラメータでポートを指定することもできます：

```shell
RUST_LOG=info target/release/phira-mp-server --port 8080
```

### Docker の場合

1. Dockerfile を作成

```
FROM ubuntu:22.04

RUN apt-get update && apt-get -y upgrade && apt-get install -y curl git build-essential pkg-config openssl libssl-dev

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
WORKDIR /root/
RUN git clone https://github.com/TeamFlos/phira-mp
WORKDIR /root/phira-mp
RUN cargo build --release -p phira-mp-server

ENTRYPOINT ["/root/phira-mp/target/release/phira-mp-server", "--port", "<preferred-port>"]
```

2. イメージをビルド
   `docker build --tag phira-mp .`

3. コンテナを実行
   `docker run -it --name phira-mp -p <prefered-port>:<preferred-port> --restart=unless-stopped phira-mp`

#### 監視

実行中のプロセスとリッスン中のポートを確認できます：

```shell
ps -aux | grep phira-mp-server
netstat -tuln | grep 12346
```
![result](https://i.imgur.com/NXC54ZZ.png)

## Windows または Android ユーザーの場合

参照: [https://docs.qq.com/doc/DU1dlekx3U096REdD](https://docs.qq.com/doc/DU1dlekx3U096REdD)

## HSNPhira 特別版

ルーム状態監視機能を提供し、phira-web-monitor/monitor-proxy と連携して使用します。

実行前に環境変数を設定してください：

```
export HSN_SECRET_KEY=<some_random_secret_key>
```

この secret key は phira-web-monitor/monitor-proxy で設定したものと同じである必要があります。
