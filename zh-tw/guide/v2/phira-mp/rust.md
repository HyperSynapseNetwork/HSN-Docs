# phira-mp

`phira-mp` 是一個用 Rust 開發的專案。 以下是部署和執行該專案伺服端的步驟。

繁體中文 | [English Version](https://github.com/HyperSynapseNetwork/phira-mp#readme)

## 環境

- Rust 1.70 或更高版本

## 伺服端安裝

### 對於 `Linux` 使用者

#### 依賴

首先，如果尚未安裝 Rust，請安裝。 您可以按照 https://www.rust-lang.org/tools/install 中的說明進行操作

對於 Ubuntu 或 Debian 使用者，如果尚未安裝「curl」，請使用以下命令進行安裝：

```shell
sudo apt install curl
```

對於 Fedora 或 CentOS 使用者，請使用以下命令：

```shell
sudo yum install curl
```

安裝curl後，使用以下命令安裝Rust：

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

然後，構建專案：

```shell
cargo build --release -p phira-mp-server
```

#### 執行伺服端

您可以使用以下命令執行該應用程式：

```shell
RUST_LOG=info target/release/phira-mp-server
```

也可以透過引數指定埠：

```shell
RUST_LOG=info target/release/phira-mp-server --port 8080
```

### For docker

1. 建立 Dockerfile

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

2. 構建映象
   `docker build --tag phira-mp .`

3. 執行容器
   `docker run -it --name phira-mp -p <prefered-port>:<preferred-port> --restart=unless-stopped phira-mp`

#### 監控

您可以檢查正在執行的行程及其正在偵聽的埠：

```shell
ps -aux | grep phira-mp-server
netstat -tuln | grep 12346
```
![result](https://i.imgur.com/NXC54ZZ.png)

## 對於 Windows 或 Android 使用者

檢視: [https://docs.qq.com/doc/DU1dlekx3U096REdD](https://docs.qq.com/doc/DU1dlekx3U096REdD)

## HSNPhira 特供

提供了房間狀態監控功能，與 phira-web-monitor/monitor-proxy 配合使用。

執行前要設定環境變數：

```
export HSN_SECRET_KEY=<some_random_secret_key>
```

這裡的 secret key 需要和 phira-web-monitor/monitor-proxy 設定的相同。
