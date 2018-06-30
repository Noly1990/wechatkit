'use strict';
const crypto = require('crypto');
/**
 * 将签名对象按照参数名ASCII码从小到大排序（字典序）排序后输出字符串
 * @param {object} args 用于转换的参数对象
 * @return {string} 产生的前面字符串
 */
function sort2string(args) {
  let keys = Object.keys(args);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach(function(key) {
    newArgs[key.toLowerCase()] = args[key];
  });
  let string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

/**
 * 随机字符串生产
 * @return {string} 产生的随机字符串
 */
function createNonceStr() {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

/**
 * 随机时间戳生产
 * @return {string} 产生的时间戳
 */
function createTimestamp() {
  return Math.floor(Date.now() / 1000) + '';
}

/**
 * MD5签名算法
 * @param {string} str 需要签名的str
 * @return {string} 生成的MD5
 */
function signMD5(str) {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
}

/**
 * SHA1签名算法
 * @param {string} str 需要签名的str
 * @return {string} 生成的SHA1
 */
function signSHA1(str) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(str, 'utf-8');
  return sha1.digest('hex');
}
module.exports = {
  createTimestamp,
  createNonceStr,
  sort2string,
  signMD5,
  signSHA1,
};
