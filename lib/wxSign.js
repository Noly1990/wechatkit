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

function sighOrder(orderInfos, mchKey) {
  const nonce_str = createNonceStr();
  let signObj = Object.assign(orderInfos, {
    nonce_str,
  });
  const str1 = sort2string(signObj);
  const str2 = str1 + `&key=${mchKey}`;
  const sign = signMD5(str2).toUpperCase();
  signObj = Object.assign(signObj, {
    sign,
  });
  return obj2xml(signObj);
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


module.exports = {
  sighOrder,
  signWXPay,
};
