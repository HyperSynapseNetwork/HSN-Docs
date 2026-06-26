# phira-mp-logprocessor

供[HSNPhira](https://gitee.com/HyperSynapse-Network/HSNPhira)使用的**日志处理器**
用于从[phira-mp-server](https://github.com/TeamFlos/phira-mp/blob/main/phira-mp-server)的 _debug_ **日志**获取信息并处理成 `json`

## installation

1. ```shell
   git clone https://gitee.com/HyperSynapse-Network/phira-mp-logprocessor.git
   cd phira-mp-logprocessor
   ```

2. ```shell
   yarn install
   ```

## usage

- ```shell
   (<phira-mp-server> |) yarn start | <HSNPhira backend>
  ```

> or you can run `yarn build` then use `yarn serve` instead of `yarn start`