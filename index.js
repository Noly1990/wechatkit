'use strict';
/**
 *@options
 *appId  appSecret
 *
 */
const axios = require('axios');

class WechatKit {
  constructor(options) {
    const {
      appId,
      appSecret,
      token,
      isMch,
    } = options;
    // 配置 appid secret token
    this.appId = appId;
    this.appSecret = appSecret;
    this.token = token;
    if (isMch) {
      const {
        mchId,
        mchKey,
        notifyUrl,
      } = options;
      // 如果还需要支付的，配置mchid 和 mchkey
      this.mchId = mchId;
      this.mchKey = mchKey;
      this.notifyUrl = notifyUrl;
    }
    // 缓存 access_token
    this.gh_access_token = '';
    this.gh_access_token_time = undefined;
    this.signType = 'MD5';
    this.init()
  }
  init(){
    console.log('kit begin to init')
    
    console.log('kit init successed')
  }
  // 随机字符串生成函数

}

module.exports = WechatKit;