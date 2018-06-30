'use strict';
/**
 *@options
 *appId  appSecret
 *
 */
const axios = require('axios');

const { sighOrder, signWXPay } = require('./lib/wxSign');

// 默认接入点
const apiUrlDefault = 'api.weixin.qq.com';

// 上海接入点
const apiUrlSH = 'sh.api.weixin.qq.com';
// 深圳接入点
const apiUrlSZ = 'sz.api.weixin.qq.com';
// 香港接入点
const apiUrlHK = 'hk.api.weixin.qq.com';

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
      // 如果还需要支付的，配置mchid mchkey notifyUrl(支付成功接收接口)
      this.mchId = mchId;
      this.mchKey = mchKey;
      this.notifyUrl = notifyUrl;
      // isMch 是否包含支付功能
      this.isMch = true;
    } else {
      // isMch 不包含支付功能
      this.isMch = false;
    }
    if (options.area) {
      switch (options.area) {
        case 'SH':
          this.baseApiUrl = apiUrlSH;
          break;
        case 'SZ':
          this.baseApiUrl = apiUrlSZ;
          break;
        case 'HK':
          this.baseApiUrl = apiUrlHK;
          break;
        default:
          this.baseApiUrl = apiUrlDefault;
          break;
      }
    } else {
      this.baseApiUrl = apiUrlDefault;
    }
    // 缓存 access_token
    // access_token 过期时间位7200秒，日请求次数为2000次，这里预定每7000秒更新一次，作为实例的公共属性保存
    // 更新为被动更新，就是如果使用前检查时间已过7000秒  或者 使用access_token 过期 ，则刷新 access_token
    this.gh_access_token = '';
    this.gh_access_token_time = undefined;
    this.signType = 'MD5';
    this.init();
  }
  /**
   * 初始化先获取一次access_token
   */
  init() {

    console.log('wechat kit begin to init');
    console.log('wechat kit init successed!');

  }

  /**
   * 获取access_token时，检查是否存在token以及是否过期，存在且在缓存期内直接返回缓存的token
   * @return {string} 返回access_token
   */
  async getAccessToken() {
    const nowTime = Math.floor(Date.now() / 1000);
    if (this.gh_access_token && (nowTime - this.gh_access_token_time < 7000)) {
      return this.gh_access_token;
    }
    await this.refreshToken();
    return this.gh_access_token;

  }
  /**
   * 刷新公众号access_token
   */
  async refreshToken() {
    console.log('refresh token');
    const {
      appId,
      appSecret,
    } = this;
    const aimUrl = `https://${this.baseApiUrl}/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    const tokenRes = await axios.get(aimUrl).catch(err => {
      console.error('refreshToken error', err);
    });
    console.log('token res', tokenRes.data);
    if (tokenRes.data.errcode && parseInt(tokenRes.data.errcode, 10) !== 0) {
      throw new Error('重要：刷新access_token错误');
    } else {
      this.gh_access_token = tokenRes.data.access_token;
      this.gh_access_token_time = Math.floor(Date.now() / 1000);
    }
  }

  /**
   *  用于获取拉用户微信Oauth2授权的url
   * @param {string} redirect_uri 授权后跳转的连接
   * @param {string} scope_type 授权作用于 snsapi_base 或 snsapi_userinfo
   * @return {string} URL
   */
  createOAuth2Url(redirect_uri, scope_type) {
    const encodedUrl = encodeURIComponent(redirect_uri);
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${encodedUrl}&response_type=code&scope=${scope_type}&state=STATE#wechat_redirect`;
  }


  /**
   * 授权作用域为snsapi_userinfo时获取用户信息的access_token,此token和公众号的access_token不是一个
   * @param {string} code 通过outh2返回的用户code
   * @return {object} 返回的是用户的access_token,openid,refresh_token等信息对象
   */
  async getUserTokenByCode(code) {
    const {
      appId,
      appSecret,
    } = this;
    const aimUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
    const tokenRes = await axios.get(aimUrl).catch(err => {
      console.error('get user Auth token err', err);
    });
    return tokenRes.data;
  }

  /**
   *  用于长时间30天的，用户refresh_token换取access_token
   * @param {string} user_refresh_token 用户刷新refresh_token
   * @return {object} 返回的是刷新后用户的access_token,openid,refresh_token等信息对象
   */
  async refreshUserToken(user_refresh_token) {
    const {
      appId,
    } = this;
    const aimUrl = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appId}&grant_type=refresh_token&refresh_token=${user_refresh_token}`;
    const refreshTokenRes = await axios.get(aimUrl).catch(err => {
      console.error('refreshUserToken err', err);
    });
    return refreshTokenRes.data;
  }

  /**
   *  用于检验用户的access_token是否有效（不常用）
   * @param {string} openId 用户openid
   * @param {string} access_token 用户当前的access_token
   * @return {object} 校验结果
   */
  async checkUserToken(openId, access_token) {
    const aimUrl = `https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openId}`;
    const checkTokenRes = await axios.get(aimUrl).catch(err => {
      console.error('checkUserToken err', err);
    });
    return checkTokenRes.data;
  }

  /**
   * 通过用户的access_token和openid获取用户信息的方法
   * @param {string} openId 用户的openid
   * @param {string} userToken 通过code或之前缓存的用户的access_token
   * @return {object} 返回的是用户信息的对象
   */
  async getUserInfoByToken(openId, userToken) {
    const aimUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${openId}&openid=${userToken}&lang=zh_CN`;
    const infoRes = await axios.get(aimUrl).catch(err => {
      console.error('get User Info err', err);
    });
    return infoRes.data;
  }

  /**
   * 获取自定义按键信息
   * @return {object} 返回获取的按钮信息
   */
  async getMenu() {
    const gh_access_token = await this.getAccessToken();
    const aimUrl = `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${gh_access_token}`;
    const menuRes = await axios.get(aimUrl).catch(err => {
      console.error('wechatkit queryMenu err', err);
    });
    return menuRes.data;
  }

  /**
   * 如何设置自定义按键详情见：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013
   * @param {object} menuObj 设置自定义按键的配置对象，
   * @return {object} 返回是否设置成功
   */
  async setMenu(menuObj) {
    const gh_access_token = await this.getAccessToken();
    const aimUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${gh_access_token}`;
    const menuRes = await axios.post(aimUrl, menuObj).catch(err => {
      console.error('wechatkit setMenu err', err);
    });
    return menuRes.data;
  }

  /**
   * 删除自定义按键配置
   * @return {object} 返回删除的结果
   */
  async deleteMenu() {
    const gh_access_token = await this.getAccessToken();
    const aimUrl = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${gh_access_token}`;
    const menuRes = await axios.get(aimUrl).catch(err => {
      console.error('wechatkit deleteMenu err', err);
    });
    return menuRes.data;
  }

  /**
   * 以下支付相关
   * ----------------------------------------------------------------------------------------
   */


  /**
   * 统一下单API ，可以兼容app, 公众号, H5等，除了接口提供的参数以下必须参数请在orderInfos中提供
   * body, out_trade_no, total_fee, spbill_create_ip, trade_type(可为APP，JSAPI，NATIVE，MWEB), 公众号还需要提供openid
   * @param {object} orderInfos 接口提供appid，mch_id，sign，nonce_str，sign_type,notify_url
   * @return {object} 返回的是拉起相关支付的必备信息
   * 其余请参见 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
   */
  async createUnifiedOrder(orderInfos) {
    if (!this.isMch) throw new Error('重要错误：未配置商户信息！');
    const aimUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    const serverInfos = {
      appid: this.appId,
      mch_id: this.mchId,
      notify_url: this.notifyUrl,
      sign_type: 'MD5',
    };
    const newObj = Object.assign(orderInfos, serverInfos);
    const signedXML = sighOrder(newObj, this.mchKey);
    const prepayRes = await axios.post(aimUrl, signedXML).catch(err => {
      console.error('createUnifiedOrder error', err);
    });
    const returnInfo = {};

    switch (orderInfos.trade_type) {
      case 'JSAPI':
        returnInfo.prepay_id = prepayRes.data.prepay_id;
        break;
      case 'APP':
        returnInfo.prepay_id = prepayRes.data.prepay_id;
        break;
      case 'MWEB':
        returnInfo.prepay_id = prepayRes.data.prepay_id;
        break;
      case 'NATIVE':
        returnInfo.prepay_id = prepayRes.data.prepay_id;
        returnInfo.code_url = prepayRes.data.code_url;
        break;
      default:
        returnInfo.prepay_id = prepayRes.data.prepay_id;
        break;
    }

    return returnInfo;
  }

  async createClientWXPayInfos(orderInfos) {
    const prepay_id = await this.createUnifiedOrder(orderInfos).prepay_id;
    return signWXPay(prepay_id, this.appId, this.mchKey);
  }
}

const midKit = require('./lib/midKit');

const msgKit = require('./lib/msgKit');

module.exports = {
  WechatKit,
  midKit,
  msgKit,
};
