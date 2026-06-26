# phira-mp-logprocessor

供[HSNPhira](https://gitee.com/HyperSynapse-Network/HSNPhira)使用的**日誌處理器**
用於從[phira-mp-server](https://github.com/TeamFlos/phira-mp/blob/main/phira-mp-server)的 _debug_ **日誌**獲取資訊並處理成 `json`

## 安裝

1. ```shell
   git clone https://gitee.com/HyperSynapse-Network/phira-mp-logprocessor.git
   cd phira-mp-logprocessor
   ```

2. ```shell
   yarn install
   ```

## 使用方式

- ```shell
   (<phira-mp-server> |) yarn start | <HSNPhira backend>
  ```

> 或者你也可以執行 `yarn build` 然後使用 `yarn serve` 來代替 `yarn start`
