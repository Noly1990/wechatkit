# Node.js 微信公众号后台通用工具箱（typescript重构中，勿用）

> 做一个简单通用的微信相关的工具箱

## 提示

模块已初步可用，请根据已完成的部分使用，还是我自己先用，再完善下
(功能还未可用，马上跟进开发，看到的请不要使用谢谢)npm上已经有一个co-wechat-api看了下还不错，但决定还是自己造个轮子，会逐步写下自己的思考过程和开发过程，放心不会偷看抄袭的，我就是自己写着玩，不求其他

## 前言

经过简单的接触了下微信公众号后台的node.js相关的看发，最初是不愿意写这样一个工具包的，因为就一个原因，微信的开发文档太烂了，当中踩了一些坑都不是因为自己失误或无知，而是自己太天真，以为一些参数和接口比较标准，没想到光光参数大小写尴尬场景都遇到很多次，但后续想一想，以后保不齐还拜托不了开发微信相关的东西，就下定决心手撸一个出来，开始一定比较粗糙，有看到的看官莫见笑

## 开发进度

1. 使用typescript重构
2. 正在重构中，请勿使用

## 预计功能列表

- 用户授权登陆
- wxJSsdk相关
- 微信支付
- 消息回复
- 公众平台的其他可实现功能

## 使用前熟读

- [微信支付文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)
- [签名校验工具](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1)
- [接收普通消息](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140453)

## Installation

```bash
 npm install @noly1990/wechatkit -S
```

```javascript
const { WechatKit } = require('@noly1990/wechatkit');

const wechatKit = new WechatKit({
  appId: 'yourappid',
  appSecret: 'yourappsecret',
  token: 'yourtoken',
  isMch: true, //是否包含商户数据，如true则需要填写往下三项，如false则不包含支付功能，后续三项则不需要填写
  mchId: 'yourmchid',
  mchKey: 'yourmchkey',
  notifyUrl: 'your notifyurl',
  area: 'SH', //地区 不填或'default','SH'上海,'SZ'深圳,'HK'香港
});

module.exports = wechatKit

```

### 其他部分（可选择使用）

msgKit用于回复用户消息的工具

midKit用于接收校验和转换微信发给自己服务器的xml消息的中间件(koa,egg等)

```javascript
const { msgKit, midKit } = require('@noly1990/wechatkit');

// midKit.buildValiMid 使用的 token 是服务器配置中填写的token
// 把以下两个中间件分别挂在公众号后台配置中填写的服务器地址上，getVali挂在GET方法上，postVali挂在在POST方法上
const getVali = midKit.buildValiMid(token,'GET')
const postVali = midKit.buildValiMid(token,'POST')

// wxMessageParser 微信发送的各种消息事件的xml转换中间件
const wxMessageParser = midKit.wxMessageParser
// 把wxMessageParser挂在postVali之后，在controller中就可以使用 ctx.MsgInfos 获取到微信发送的各种消息

// obj 中填写的是从midKit中获取的MsgInfos 或自己填写 FromUserName 和 ToUserName 从
// 返回的是结构化的xml字符串，可直接回复给微信服务器
msgKit.textMsg(content,obj)
msgKit.imgMsg(mediaId,obj)
msgKit.voiceMsg(mediaId,obj)

// 示例 以koa为例
ctx.body = msgKit.textMsg('这是要回复的内容',ctx.MsgInfos)
ctx.body = msgKit.imgMsg('素材库中图片的mediaId',ctx.MsgInfos)
ctx.body = msgKit.voiceMsg('素材库中声音的mediaId',ctx.MsgInfos)

//在koa和egg中还提供挂在在ctx对象上的直接回复的功能
//以egg中，extend为例
// /app/extend/context.js
const { replyText, replyImg, replyVoice } = require('@noly1990/wechatkit').msgKit;
module.exports = {
  replyText,
  replyImg,
  replyVoice
}

// 在controller中就可以调用 ctx.replyText 直接回复本次消息
 ctx.replyText(content);
 ctx.replyText('这是要回复的内容');


```

## 使用方法

每一个独立的appid，通过class wechatKit创建一个实例，把它挂载在全局app下，之后都使用之前创建的实例，除非需要对接额外的appid

## API

```javascript
// 以下 wechatKit 都是通过WechatKit new出来的实例

// 通过getAccessToken获得当前的后台的access_token,会自行查证有效性和刷新，不用关心access_token的有效期
// 初步简单实现，后续会优化整个逻辑，初步可用
wechatKit.getAccessToken() //异步

// 创建给用户点击授权的Oauth2的连接,
// redirect_uri 授权后跳转链接
// scope_type 授权类型 snsapi_base 或 snsapi_userinfo 一般使用snsapi_userinfo以获取用户信息
wechatKit.createOAuth2Url(redirect_uri, scope_type) //同步

// 通过oauth2链接获得code以后使用getUserTokenByCode获得用户的access_token 注意此token非后台access_token
wechatKit.getUserTokenByCode(code) //异步

// 通过特定的openid和他的userToken获得用户信息
wechatKit.getUserInfoByToken(openId,userToken) // 异步

// 获取自定义按钮信息，设置自定义按钮，删除自定义按钮
// 格式参见 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013
wechatKit.getMenu() // 异步
wechatKit.setMenu(menuObj) // 异步
wechatKit.deleteMenu() // 异步

// 支付接口需要填写mch信息
// orderInfos 填写所需的body, total_fee , attach, out_trade_no 等 
// 参数参见 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
// 返回的是可以直接拉起jssdk中 wx.chooseWXPay()的所有参数
// wx.chooseWXPay参见 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
wechatKit.createClientWXPayInfos(orderInfos) // 异步

// 当支付成功在你的notifyUrl上会受到微信服务器post过来的xml支付信息
// 这里稍后会提供一个支付信息转化的中间件
// 本接口通过transaction_id去微信服务器查证对应订单的真实性，返回查证信息
wechatKit.checkWXPayment(transaction_id) //异步

```

## 开发思路

本工具箱，并不限定使用具体的某一个后台框架，但会对主流框架集成做一定的优化，不限制使用者的自由

同时也会对开发环境的需求做相应的设计，以满足具体情况下的高可用

微信相关的开发比较麻烦的点就在签名校验，主要实现通用的签名算法， 初步先实现MD5版本的加密签名，后续再跟进sha256的

公众号的自动回复我觉得有两个实现方式，一种就是用微信提供的接口去设置自动回复，第二种就是自己在后台维护一份自动回复的配置

## 实现列表

- 统一下单API => https://api.mch.weixin.qq.com/pay/unifiedorder
- 生成用于拉起微信公众号支付的信息的API
- 生成用于拉起APP支付的信息的API
- JSsdk签名API
- 一个初始的设置微信服务器的Get接收签名校验件（简化配置）=>已完成
- 一个用户转换微信POST到本服务器的xml消息和事件的中间件 =>已完成
- 一个用于生成给用户发送消息xml的功能件 =>完成文本图片声音的生成和发送