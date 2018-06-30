'use strict';
/**
 * errcode 全局返回码，统一设置为string类型，对错误进行定位指示
 */
module.exports = {
  '-1': '系统繁忙，此时请开发者稍候再试',
  0: '请求成功',
  40001: '获取 access_token 时 AppSecret 错误，或者 access_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口',
}
;
