 
# Ksher SDK nodejs
[![Node.js Package](https://github.com/ksher-solutions/ksher_sdk_nodejs/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ksher-solutions/ksher_sdk_nodejs/actions/workflows/npm-publish.yml)
[![Version](https://img.shields.io/npm/v/@kshersolution/ksher)](https://www.npmjs.com/package/@kshersolution/ksher)

Ksher payment SDK for NodeJs. Please check document at http://api.ksher.net

Another SDK please check at

Java: https://github.com/ksher-api/ksher-sdk/tree/master/java

Python: https://github.com/ksher-solutions/ksher_sdk_python

Go: https://github.com/ksher-api/ksher-sdk/tree/master/go

PHP: https://github.com/ksher-api/ksher-sdk/tree/master/php

Netcore: https://github.com/ksher-api/ksher-sdk/tree/master/netcore

NodeJs: https://github.com/ksher-solutions/ksher_sdk_nodejs

## How to install SDK

Install nodejs on you computer.

Check your nodejs working with your computer by using

```shell
node -v
```

Install ksher SDK by 

```shell
npm install @kshersolution/ksher
```
or clone from

```shell
git clone https://github.com/ksher-solutions/ksher_sdk_nodejs
```

## using SDK

Initial data to call

```nodejs
const appid = "mch35000";  // setup your appid at here
const path = "/Users/example/ksher_sdk_nodejs/Mch35000_PrivateKey.pem"; // setup your private key path at here

const KsherPay = require('@kshersolution/ksher');
const sdk = new KsherPay(appid, path)
```
alternative way you can read your private key from string

```nodejs
const appid = "mch35000";  // setup your appid at here
const privatekey =`-----BEGIN RSA PRIVATE KEY-----
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END RSA PRIVATE KEY-----
`;
// setup your private key data inside pem file at here

const KsherPay = require('@kshersolution/ksher');
const sdk = new KsherPay(appid, privatekey)
```

## Website

Please see http://api.ksher.net/KsherAPI/dev/apis/website.html for more information.

### create website request
```nodejs
const mch_order_no = Date.now().toString();
const gateway_payRequestData = {   
  "mch_order_no": mch_order_no,
  "total_fee": "100",
  "fee_type": "THB",
  "mch_code": mch_order_no,
  "refer_url": "https://www.google.com",
  "mch_redirect_url":"https://www.google.com/api/gateway_pay/success",
  "mch_redirect_url_fail":"https://www.google.comapi/gateway_pay/fail",
  "mch_notify_url":"https://www.google.com/api/gateway_pay/notify_url/",
  "product_name": mch_order_no,
  "channel_list":"promptpay,linepay,airpay,truemoney,atome,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal,scb_easy,bbl_deeplink,baybank_deeplink,kplus,alipay,wechat,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal",
  "lang":"en"
};
await sdk.gateway_pay(gateway_payRequestData)
  .then(response => {
    console.log("body: ",response);
  });
.catch(error => {
    console.log(error);
  });
```
### query status

```nodejs
const mch_order_no = "your create mch_order_no";
const gateway_order_queryData = {   
  "mch_order_no": mch_order_no
};

await sdk.gateway_order_query(gateway_order_queryData)
  .then(response => {
    console.log("body: ",response);
});
.catch(error => {
  console.log(error);
});
```

## C scan B

### Create Dynamic QR
Please see http://api.ksher.net/KsherAPI/dev/apis/kiosk_c_scan_b.html for more information.
```nodejs
const mch_order_no = Date.now().toString();
const native_payRequestData = {
      mch_order_no: mch_order_no,
      total_fee: "100",
      fee_type:"THB",
      channel: "promptpay"
  };

await sdk.native_pay(native_payRequestData)
.then(response => {
  console.log("body: ",response);
});
.catch(error => {
  console.log(error);
});
```

### query status

```nodejs
const mch_order_no = "your create mch_order_no";
const native_payQueryData = {
    mch_order_no: "2023-02-19-17-34-00",
  };

await sdk.order_query(native_payQueryData)
.then(response => {
  console.log("body: ",response);
});
.catch(error => {
  console.log(error);
});
```