'use strict';

const {
  signSHA1,
} = require('./utils');

const {
  xml2obj,
} = require('./xmlTools');

function buildValiMid(token, type) {
  function checkWX(signature, timestamp, nonce) {
    const str = [ token, timestamp, nonce ].sort().join('');
    console.log('token is ->', token);
    const newStr = signSHA1(str);
    if (newStr === signature) return true;
    return false;
  }
  if (type.toLowerCase() === 'post') {
    return function postSign(ctx, next) {
      if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce) return;
      const {
        signature,
        timestamp,
        nonce,
      } = ctx.query;
      if (checkWX(signature, timestamp, nonce)) {
        return next();
      }
      return;
    };
  } else if (type.toLowerCase() === 'get') {
    return function getVali(ctx) {
      if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce) return;
      const {
        signature,
        timestamp,
        nonce,
      } = ctx.query;
      if (checkWX(signature, timestamp, nonce)) {
        ctx.body = ctx.query.echostr;
      } else {
        return;
      }
    };
  }
  throw new Error('buildValiMid error:type not match');
}


/**
 * 用户配置在填写的服务器url上的Post方法，同于接受并转化微信给服务器发送的信息和事件
 * @param {context} ctx koa ctx
 * @param {context} next koa next
 */
async function wxMessageParser(ctx, next) {
  if (ctx.method === 'POST' && ctx.is('text/xml')) {
    const messageInfos = await new Promise(function(resolve) {
      let xml = '';
      ctx.req.setEncoding('utf8');
      ctx.req.on('data', chunk => {
        xml += chunk;
      });
      ctx.req.on('end', () => {
        ctx.xml = xml;
        const returnObj = xml2obj(xml);
        resolve(returnObj);
      });
    });
    ctx.MsgInfos = messageInfos.xml;
    await next();
  } else {
    await next();
  }
}

module.exports = {
  buildValiMid,
  wxMessageParser,
};
