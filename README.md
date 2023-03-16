 
# Ksher SDK nodejs

SDK for nodejs

## install SDK

 ```
 npm install
 ```

## using SDK

```
const KsherPay = require('ksher_sdk_nodejs');
const appid = "mch35000";
const path = "/Users/example/ksher_sdk_nodejs/Mch35000_PrivateKey.pem";
const sdk = new KsherPay(appid, path)
```

## redirect

Please see http://api.ksher.net/KsherAPI/dev/apis/website.html for more information.

```
const KsherPay = require('ksher_sdk_nodejs');

const appid = "mch35000";
const path = "/Users/example/ksher_sdk_nodejs/Mch35000_PrivateKey.pem";

const sdk = new KsherPay(appid, path)
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

```