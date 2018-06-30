'use strict';

const {
  obj2xml,
} = require('./xmlTools');

const { createTimestamp } = require('./utils');

function textMsg(content, obj) {
  const returnObj = {};
  returnObj.FromUserName = obj.ToUserName;
  returnObj.ToUserName = obj.FromUserName;
  returnObj.CreateTime = createTimestamp();
  returnObj.MsgType = 'text';
  returnObj.Content = content;
  const returnXml = obj2xml({
    xml: returnObj,
  });
  return returnXml;
}

function imgMsg(mediaId, obj) {
  const returnObj = {};
  returnObj.FromUserName = obj.ToUserName;
  returnObj.ToUserName = obj.FromUserName;
  returnObj.CreateTime = createTimestamp();
  returnObj.MsgType = 'image';
  returnObj.MediaId = mediaId;
  const returnXml = obj2xml({
    xml: returnObj,
  });
  return returnXml;
}

function voiceMsg(mediaId, obj) {
  const returnObj = {};
  returnObj.FromUserName = obj.ToUserName;
  returnObj.ToUserName = obj.FromUserName;
  returnObj.CreateTime = createTimestamp();
  returnObj.MsgType = 'voice';
  returnObj.MediaId = mediaId;
  const returnXml = obj2xml({
    xml: returnObj,
  });
  return returnXml;
}

function replyText(content) {
  const MsgInfos = this.MsgInfos;
  this.body = textMsg(content, MsgInfos);
}

function replyImg(mediaId) {
  const MsgInfos = this.MsgInfos;
  this.body = imgMsg(mediaId, MsgInfos);
}

function replyVoice(mediaId) {
  const MsgInfos = this.MsgInfos;
  this.body = voiceMsg(mediaId, MsgInfos);
}

module.exports = {
  textMsg,
  imgMsg,
  voiceMsg,
  replyText,
  replyImg,
  replyVoice,
};
