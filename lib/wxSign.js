'use strict';

const {
  signMD5,
  createNonceStr,
  createTimestamp,
  sort2string,
} = require('./utils');
const {
  obj2xml,
} = require('./xmlTools');


function normalSigh(signInfos, mchKey) {
  const nonce_str = createNonceStr();
  let signObj = Object.assign(signInfos, {
    nonce_str,
  });
  const str1 = sort2string(signObj);
  const str2 = str1 + `&key=${mchKey}`;
  const sign = signMD5(str2).toUpperCase();
  signObj = Object.assign(signObj, {
    sign,
  });
  return obj2xml({ xml: signObj });
}

/**
 *  给微信客户端的jssdk用户拉起chooseWXPay的返回信息
 * @param {string} prepay_id 通过统一下单得到的prepay_id
 * @param {string} appId appid
 * @param {string} mchKey mchkey
 * @return {object} 返回的是拉起微信支付的参数对象
 */
function signWXPay(prepay_id, appId, mchKey) {
  const nonceStr = createNonceStr();
  const timestamp = createTimestamp();
  const signType = 'MD5';
  const ipackage = 'prepay_id=' + prepay_id;
  const stringA = `appId=${appId}&nonceStr=${nonceStr}&package=${ipackage}&signType=${signType}&timeStamp=${timestamp}`;
  const stringSignTemp = stringA + `&key=${mchKey}`;
  const paySign = signMD5(stringSignTemp).toUpperCase();
  return {
    nonceStr,
    timestamp,
    package: ipackage,
    signType,
    paySign,
  };
}

/**
 *  给app内的微信支付sdk用户拉起微信支付的返回信息
 * @param {string} prepay_id 通过统一下单得到的prepay_id
 * @param {string} appId appid
 * @param {string} mchId mchId
 * @param {string} mchKey mchkey
 * @return {object} 返回的是APP拉起微信支付的参数对象
 */
function signAppPay(prepay_id, appId, mchId, mchKey) {
  const noncestr = createNonceStr();
  const timestamp = createTimestamp();
  const ipackage = 'Sign=WXPay';
  const stringA = `appid=${appId}&noncestr=${noncestr}&package=${ipackage}&partnerid=${mchId}&prepayid=${prepay_id}&timestamp=${timestamp}`;
  const stringSignTemp = stringA + `&key=${mchKey}`;
  const sign = signMD5(stringSignTemp).toUpperCase();
  return {
    appid: appId,
    noncestr,
    timestamp,
    sign,
    package: ipackage,
    partnerid: mchId,
    prepayid: prepay_id,
  };
}

module.exports = {
  normalSigh,
  signWXPay,
  signAppPay,
};
