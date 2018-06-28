'use strict';
/**
 *@options
 *appId  appSecret
 *
 */
class WxKits {
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
  }

  // 随机字符串生成函数
  createNonceStr() {
    const randomStr = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    return randomStr;
  }
  // 随机时间戳生成函数
  createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
  }
}

module.exports = WxKits;