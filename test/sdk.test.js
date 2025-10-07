jest.setTimeout(30000);
const KsherPay = require("../src/sdk");
const config = require('../test/config')
appid = config.appid;
privatekey = config.privatekey;

describe("SDK", () => {
  test("create", () => {
    const sdk = new KsherPay(appid, privatekey);
    
    // Assertions
    expect(sdk.appid).toBe(appid);
    expect(sdk.privateKey).not.toBe("");
    expect(sdk.publicKey).not.toBe("");
  });

  test("addRequestHeader", () => {
    const sdk = new KsherPay(appid, privatekey);
    const gateway_payRequestData = {
      mch_order_no: "2023-02-22-17-11-00",
      total_fee: "100",
      fee_type: "THB",
      mch_code: "2023-02-22-17-11-00",
      refer_url: "https://www.google.com",
      mch_redirect_url: "https://www.google.com/api/gateway_pay/success",
      mch_redirect_url_fail: "https://www.google.com/api/gateway_pay/fail",
      mch_notify_url: "https://www.google.com/api/gateway_pay/notify_url/",
      product_name: "2023-02-20-17-27-00",
      channel_list: "promptpay,linepay,airpay,truemoney,atome,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal,scb_easy,bbl_deeplink,baybank_deeplink,kplus,alipay,wechat,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal",
      lang: "en",
    };

    const dataWithHeader = sdk.addRequestHeader(gateway_payRequestData);
    
    // Assertions
    expect(dataWithHeader.appid).toBe(appid);
    expect(dataWithHeader.nonce_str).not.toBe("");
    expect(dataWithHeader.time_stamp).not.toBe("");
  });
});


  test("createSignature", () => {
    const sdk = new KsherPay(appid, privatekey);
    const gateway_payRequestData = {
      mch_order_no: "2023-02-22-17-11-00",
      total_fee: "100",
      fee_type: "THB",
      mch_code: "2023-02-22-17-11-00",
      refer_url: "https://www.google.com",
      mch_redirect_url: "https://www.google.com/api/gateway_pay/success",
      mch_redirect_url_fail: "https://www.google.com/api/gateway_pay/fail",
      mch_notify_url: "https://www.google.com/api/gateway_pay/notify_url/",
      product_name: "2023-02-20-17-27-00",
      channel_list: "promptpay,linepay,airpay,truemoney,atome,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal,scb_easy,bbl_deeplink,baybank_deeplink,kplus,alipay,wechat,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal",
      lang: "en",
    };
  
    const dataWithHeader = sdk.addRequestHeader(gateway_payRequestData);
    const signature = sdk.createSignature(dataWithHeader);
  
    // Assertions
    expect(signature).not.toBe("");
  });  

  test("gateway_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const gateway_payRequestData = {
        mch_order_no: mch_order_no,
        total_fee: "100",
        fee_type: "THB",
        mch_code: mch_order_no,
        refer_url: "https://www.google.com",
        mch_redirect_url: "https://www.google.com/api/gateway_pay/success",
        mch_redirect_url_fail: "https://www.google.com/api/gateway_pay/fail",
        mch_notify_url: "https://www.google.com/api/gateway_pay/notify_url/",
        product_name: mch_order_no,
        channel_list: "promptpay,linepay,airpay,truemoney,atome,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal,scb_easy,bbl_deeplink,baybank_deeplink,kplus,alipay,wechat,card,ktc_instal,kbank_instal,kcc_instal,kfc_instal",
        lang: "en",
      };
  
      const response = await sdk.gateway_pay(gateway_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("SUCCESS");
      expect(response.data.pay_content).not.toBe("");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("gateway_order_query", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "2023-02-22-17-11-00";
      const gateway_order_queryData = {
        mch_order_no: mch_order_no,
      };
  
      const response = await sdk.gateway_order_query(gateway_order_queryData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("操作成功");
      expect(response.data.appid).toBe(appid);
      expect(response.data.mch_order_no).toBe(mch_order_no);
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("native_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const native_payRequestData = {
        mch_order_no: mch_order_no,
        total_fee: "100",
        fee_type: "THB",
        channel: "bbl_promptpay",
      };
  
      const response = await sdk.native_pay(native_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.data.result).toBe("SUCCESS");
      expect(response.data.appid).toBe(appid);
      expect(response.data.mch_order_no).toBe(mch_order_no);
      expect(response.data.imgdat).toMatch("data:image/");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("native_pay order_query", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "1739439777";
      const native_payQueryData = { mch_order_no };
  
      const response = await sdk.order_query(native_payQueryData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
      expect(response.data.appid).toBe(appid);
      expect(response.data.mch_order_no).toBe(mch_order_no);
      expect(response.data.imgdat).not.toBe("");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("quick_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const quick_payRequestData = {
        mch_order_no: mch_order_no,
        total_fee: "100",
        fee_type: "THB",
        channel: "truemoney",
        auth_code: "111111111111111111",
      };
  
      const response = await sdk.quick_pay(quick_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.data.ksher_order_no).not.toBe("");
      expect(response.data.time_stamp).not.toBe("");
      expect(response.data.mch_order_no).toBe(mch_order_no);
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("quick_pay order_query", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "1692961137806";
      const quick_payQueryData = { mch_order_no };
  
      const response = await sdk.order_query(quick_payQueryData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
      expect(response.data.channel_order_no).not.toBe("");
      expect(response.data.mch_order_no).toBe(mch_order_no);
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("app_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString(); // Generate unique order number
      const app_payRequestData = {
        mch_order_no: mch_order_no,
        total_fee: "100",
        fee_type: "THB",
        channel: "wechat",
        product_name: "some product",
        refer_url: "http://www.google.com",
        notify_url: "https://your_notify_url.com/notify",
        local_total_fee: 10000,
        channel_sub_appid: "wxxxxxxxxxxxx",
      };
  
      const response = await sdk.app_pay(app_payRequestData);
  
      // Assertions
      console.log("body: ", response);
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("mini_program_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const mini_program_payRequestData = {
        mch_order_no: mch_order_no,
        total_fee: "100",
        fee_type: "THB",
        channel: "wechat",
        product_name: "some product",
        refer_url: "http://www.google.com",
        notify_url: "https://your_notify_url.com/notify",
        local_total_fee: 10000,
        channel_sub_appid: "wx8888888888888888",
        sub_openid: "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
      };
  
      const response = await sdk.mini_program_pay(mini_program_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
    } catch (error) {
      console.log("Error:", error);
    }
  });
  

  test("wap_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const wap_payRequestData = {
        mch_order_no: mch_order_no,
        fee_type: "THB",
        channel: "alipay",
        product_name: "some product",
        refer_url: "http://www.google.com",
        redirect_url: "https://7156-101-51-94-230.ap.ngrok.io/api/gateway_pay/success",
        notify_url: "https://your_notify_url.com/notify",
        local_total_fee: 100,
        sub_openid: "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
      };
  
      const response = await sdk.wap_pay(wap_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("jsapi_pay", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = Date.now().toString();
      const jsapi_payRequestData = {
        mch_order_no: mch_order_no,
        fee_type: "THB",
        channel: "wechat",
        paypage_title: "TestJSAPI",
        redirect_url: "https://7156-101-51-94-230.ap.ngrok.io/api/gateway_pay/success",
        notify_url: "https://your_notify_url.com/notify",
        total_fee: 100,
      };
  
      const response = await sdk.jsapi_pay(jsapi_payRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("order_reverse", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "20230608171600";
      const order_reverseRequestData = {
        mch_order_no: mch_order_no,
        fee_type: "THB",
        channel: "wechat",
      };
  
      const response = await sdk.order_reverse(order_reverseRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
    } catch (error) {
      console.log("Error:", error);
    }
  });
  
  test("merchant info", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const response = await sdk.merchant_info({});
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
      expect(response.status_msg).toBe("");
      expect(response.data.mch_appid).toBe(appid);
      expect(response.data.account_type).not.toBe("");
      expect(response.data.business_mode).not.toBe("");
      expect(response.data.mch_name.mch_brief_name).not.toBe("");
    } catch (error) {
      console.log("Error:", error);
    }
  });
  
  test("refund_query", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "202308211903";
      const refund_queryRequestData = { mch_order_no };
  
      const response = await sdk.refund_query(refund_queryRequestData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.data.ksher_order_no).not.toBe("");
      expect(response.data.time_stamp).not.toBe("");
      expect(response.data.mch_order_no).toBe(mch_order_no);
    } catch (error) {
      console.log("Error:", error);
    }
  });  

  test("order_query_payout", async () => {
    try {
      const sdk = new KsherPay(appid, privatekey);
      const mch_order_no = "202308221330";
      const order_query_payoutData = {
        mch_order_no: mch_order_no,
        channel: "payout",
        operator_id: 45802,
      };
  
      const response = await sdk.order_query_payout(order_query_payoutData);
  
      // Assertions
      expect(response.code).toBe(0);
      expect(response.msg).toBe("ok");
      expect(response.data.appid).toBe(appid);
      expect(response.data.mch_order_no).toBe(mch_order_no);
      expect(response.data.ksher_order_no).not.toBe("");
    } catch (error) {
      console.log("Error:", error);
    }
  });  
  
