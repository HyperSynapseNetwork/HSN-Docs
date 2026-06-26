# phira-mp-logprocessor

[HSNPhira](https://gitee.com/HyperSynapse-Network/HSNPhira) で使用する**ログプロセッサー**
[phira-mp-server](https://github.com/TeamFlos/phira-mp/blob/main/phira-mp-server) の _debug_ **ログ**から情報を取得し、`json` に処理します。

## インストール

1. ```shell
   git clone https://gitee.com/HyperSynapse-Network/phira-mp-logprocessor.git
   cd phira-mp-logprocessor
   ```

2. ```shell
   yarn install
   ```

## 使用方法

- ```shell
   (<phira-mp-server> |) yarn start | <HSNPhira backend>
  ```

> または `yarn build` を実行した後、`yarn start` の代わりに `yarn serve` を使用することもできます。
