
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
var qs = require('qs');

class Unity {
    static generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    
    static convertData2Str(data){
        const obj = {};
        Object.keys(data)
          .sort()
          .forEach((key) => {
            if (key !== "sign") obj[key] = data[key];
          });

        var keyvalue = Object.entries(obj)
            .map(([key, value]) => key + "=" + value)
            .join("");
        // console.log("string make signature: ", keyvalue)
    return keyvalue;
    }
}

module.exports = Unity