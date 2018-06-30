const {
  signSHA1
} = require('./utils')

const {
  xml2obj
} = require('./xmlTools')

function checkWX(signature, timestamp, nonce) {
  let token = 't1h2i3s4i5s6m7y8t9o0ken'
  var str = [token, timestamp, nonce].sort().join('');
  let newStr = signSHA1(str);
  if (newStr === signature) return true;
  else return false;
}

/**
 * 在填写的配置服务器的url上的Get方法下配置之歌handler,对填写配置服务器时进行验证，Get不需要再处理直接返回ctx.body
 * @param {context} ctx 
 * @param {next} next 
 */
function getSign(ctx, next) {
  if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce) return
  const {
    signature,
    timestamp,
    nonce
  } = ctx.query;
  if (checkWX(signature, timestamp, nonce)) {
    ctx.body = ctx.query.echostr
  } else {
    return
  }
}

/**
 * 在填写的配置服务器的url上的Get方法下配置之歌handler,对填写配置服务器时进行验证,post需要后续处理
 * @param {context} ctx 
 * @param {next} next 
 */
function postSign(ctx, next) {
  if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce) return
  const {
    signature,
    timestamp,
    nonce
  } = ctx.query;
  if (checkWX(signature, timestamp, nonce)) {
    return next()
  } else {
    return
  }
}

/**
 * 用户配置在填写的服务器url上的Post方法，同于接受并转化微信给服务器发送的信息和事件
 * @param {XMLHttpRequest} request 
 */
async function wxMessageParser(ctx, next) {
  if (ctx.method === "POST" && ctx.is('text/xml')) {
    let messageInfos = await new Promise(function (resolve, reject) {
      let xml = '';
      ctx.req.setEncoding('utf8')
      ctx.req.on('data', (chunk) => {
        xml += chunk
      })
      ctx.req.on('end', () => {
        let returnObj=xml2obj(xml)
        resolve(returnObj)
      })
    })
    ctx.messageInfos = messageInfos
    await next()
  } else {
    await next()
  }
}

module.exports = {
  getSign,
  postSign,
  wxMessageParser
}