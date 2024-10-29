const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const path = require("path");
const Unity = require("./unity");
const { error } = require("console");

class KsherPay {
  DOMAIN = "https://api.mch.ksher.net/KsherPay";
  GATEWAY_DOMAIN = "https://gateway.ksher.com/api";

  appid = "";
  privateKey = "";
  timeout = 0;
  publicKey = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQC+/eeTgrjeCPHmDS/5osWViFyIAryFRIr5canaYhz3Di3UNkT0sf6TkabF
LvxPcM9JmEtj2O4TXNpgYATkE/sFAgMBAAE=
-----END RSA PUBLIC KEY-----
`;

  /**
   * @param {string} appid - appid
   * @param {string} privatekeyPath - Path to private key or private key text.
   * @param {string} publicKeyPath - (optional) Path to public key or public key text.
   * @param {number} timeout - (optional) Timeout for API call in milliseconds (0 = no timeout, e.g., 10000 = 10 seconds)
   */
  constructor(appid, privatekeyPath = "", publicKeyPath = "", timeout = 0) {
    this.appid = appid;

    // if (typeof appid !== "string") {
    //   throw new TypeError("appid must be a string");
    // }
    // if (typeof privatekeyPath !== "string") {
    //   throw new TypeError("privatekeyPath must be a string");
    // }
    // if (typeof publicKeyPath !== "string") {
    //   throw new TypeError("publicKeyPath must be a string");
    // }
    // if (typeof timeout !== "number") {
    //   throw new TypeError("timeout must be a number");
    // }

    if (Unity.isPrivateKeyPEMFormat(privatekeyPath)) {
      this.privateKey = privatekeyPath;
    } else {
      this.privateKey = fs.readFileSync(privatekeyPath);
    }

    if (publicKeyPath != "") {
      this.publicKey = fs.readFileSync(publicKeyPath);
    }
    if (this.timeout != 0) {
      this.timeout = timeout;
    }
  }

  createSignature(data) {
    const keyvalue = Unity.convertData2Str(data);
    // console.log("string make signature: ", keyvalue)

    const signer = crypto.createSign("RSA-MD5");
    signer.write(keyvalue);
    signer.end();

    const signature = signer.sign(this.privateKey, "hex");

    // console.log(signature);
    return signature;
  }

  verifySignature(data) {
    var message = "";
    if (
      "mobile" in data.data &&
      "mch_id" in data.data &&
      "account_type" in data.data &&
      "business_mode" in data.data &&
      "nonce_str" in data.data
    ) {
      var merchant_info_verify_message = {
        mobile: data.data.mobile,
        mch_id: data.data.mch_id,
        account_type: data.data.account_type,
        business_mode: data.data.business_mode,
        nonce_str: data.data.nonce_str,
      };
      // console.log(merchant_info_verify_message);
      message = Unity.convertData2Str(merchant_info_verify_message);
    } else {
      message = Unity.convertData2Str(data.data);
    }

    const signature = data.sign;
    // console.log("verifySignature: ",signature)
    // console.log("text make sign: ",message)
    const verifier = crypto.createVerify("RSA-MD5");
    verifier.write(message);
    verifier.end();

    const isVerified = verifier.verify(this.publicKey, signature, "hex");

    // console.log(isVerified);
    return isVerified;
  }
  addRequestHeader(data) {
    const nonce_str = Unity.generateRandomString(32);
    var time_stamp = Date.now();
    var headerdata = {
      appid: this.appid,
      nonce_str: nonce_str,
      time_stamp: time_stamp,
    };
    return { ...headerdata, ...data };
  }

  async ksherRequest(url, method = "POST", data) {
    var dataWithHeader = this.addRequestHeader(data);
    var signature = this.createSignature(dataWithHeader);
    var bodyWithSign = { ...dataWithHeader, ...{ sign: signature } };

    var strdata = qs.stringify(bodyWithSign);
    // console.log("strdata:", strdata);

    var config = {
      method: method,
      timeout: this.timeout,
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: strdata,
    };
    // console.log("config: ", config);
    const response = await axios(config);
    // console.log("response.data: ", response.data);
    // console.log("response.status: ", response.status);
    // console.log("response.statusText: ", response.statusText);
    // console.log("response.headers: ", response.headers);
    // console.log("response.config: ", response.config);
    const jsonData = JSON.stringify(response.data);
    if (response.data.code == 0) {
      if (this.verifySignature(response.data) == false) {
        return {
          code: 0,
          data: {
            err_code: "VERIFY_KSHER_SIGN_FAIL",
            err_msg: "verify signature failed",
            result: "FAIL",
          },
          msg: "ok",
          sign: "",
          status_code: "",
          status_msg: "",
          time_stamp: "",
          version: "",
        };
      }
    }
    return response.data;
  }
  gateway_pay(data) {
    const url = this.GATEWAY_DOMAIN + "/gateway_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  gateway_order_query(data) {
    const url = this.GATEWAY_DOMAIN + "/gateway_order_query";
    // remove operator_id from query not support this param
    if ("operator_id" in data) {
      delete data.operator_id;
    }
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  cancel_order(data) {
    const url = this.GATEWAY_DOMAIN + "/cancel_order";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  order_refund(data) {
    const url = this.DOMAIN + "/order_refund";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  order_reverse(data) {
    const url = this.DOMAIN + "/order_reverse";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  native_pay(data) {
    const url = this.DOMAIN + "/native_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  order_query(data) {
    const url = this.DOMAIN + "/order_query";
    // remove operator_id from query not support this param
    if ("operator_id" in data) {
      delete data.operator_id;
    }
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  quick_pay(data) {
    const url = this.DOMAIN + "/quick_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  app_pay(data) {
    const url = this.DOMAIN + "/app_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  mini_program_pay(data) {
    const url = this.DOMAIN + "/mini_program_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  wap_pay(data) {
    const url = this.DOMAIN + "/wap_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  jsapi_pay(data) {
    const url = this.DOMAIN + "/jsapi_pay";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  refund_query(data) {
    const url = this.DOMAIN + "/refund_query";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  order_close(data) {
    const url = this.DOMAIN + "/order_close";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  payout(data) {
    const url = this.DOMAIN + "/payout";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  order_query_payout(data) {
    const url = this.DOMAIN + "/order_query_payout";
    // remove operator_id from query not support this param
    if ("operator_id" in data) {
      delete data.operator_id;
    }
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  get_payout_balance(data) {
    const url = this.DOMAIN + "/get_payout_balance";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  rate_query(data) {
    const url = this.DOMAIN + "/rate_query";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  merchant_info(data) {
    const url = this.DOMAIN + "/merchant_info";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }

  get_settlement_info(data) {
    const url = this.DOMAIN + "/get_settlement_info";
    const resp = this.ksherRequest(url, "POST", data);
    return resp;
  }
}
module.exports = KsherPay;
