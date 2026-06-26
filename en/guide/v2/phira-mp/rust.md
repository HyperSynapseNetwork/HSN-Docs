# phira-mp

`phira-mp` is a project developed in Rust. Below are the steps to deploy and run the server.

简体中文 | [English Version](https://github.com/HyperSynapseNetwork/phira-mp#readme)

## Environment

- Rust 1.70 or higher

## Server Installation

### For `Linux` Users

#### Dependencies

First, install Rust if not already installed. You can follow the instructions at https://www.rust-lang.org/tools/install

For Ubuntu or Debian users, if `curl` is not already installed, install it with the following command:

```shell
sudo apt install curl
```

For Fedora or CentOS users, use the following command:

```shell
sudo yum install curl
```

After installing curl, install Rust using the following command:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Then, build the project:

```shell
cargo build --release -p phira-mp-server
```

#### Run the Server

You can run the application using the following command:

```shell
RUST_LOG=info target/release/phira-mp-server
```

You can also specify a port via arguments:

```shell
RUST_LOG=info target/release/phira-mp-server --port 8080
```

### For Docker

1. Create a Dockerfile

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

2. Build the image
   `docker build --tag phira-mp .`

3. Run the container
   `docker run -it --name phira-mp -p <prefered-port>:<preferred-port> --restart=unless-stopped phira-mp`

#### Monitoring

You can check the running process and the ports it is listening on:

```shell
ps -aux | grep phira-mp-server
netstat -tuln | grep 12346
```
![result](https://i.imgur.com/NXC54ZZ.png)

## For Windows or Android Users

See: [https://docs.qq.com/doc/DU1dlekx3U096REdD](https://docs.qq.com/doc/DU1dlekx3U096REdD)

## HSNPhira Exclusive

Provides room status monitoring functionality, used in conjunction with phira-web-monitor/monitor-proxy.

Set environment variables before running:

```
export HSN_SECRET_KEY=<some_random_secret_key>
```

The secret key here must match the one set in phira-web-monitor/monitor-proxy.
