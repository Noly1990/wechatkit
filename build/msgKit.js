"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceMsg = exports.imgMsg = exports.textMsg = void 0;
const utils_1 = require("./utils");
const xml_1 = require("./xml");
function textMsg(content, obj) {
    const returnObj = {};
    returnObj.FromUserName = obj.ToUserName;
    returnObj.ToUserName = obj.FromUserName;
    returnObj.CreateTime = utils_1.createTimestamp();
    returnObj.MsgType = 'text';
    returnObj.Content = content;
    const returnXml = xml_1.obj2xml({
        xml: returnObj,
    });
    return returnXml;
}
exports.textMsg = textMsg;
function imgMsg(mediaId, obj) {
    const returnObj = {};
    returnObj.FromUserName = obj.ToUserName;
    returnObj.ToUserName = obj.FromUserName;
    returnObj.CreateTime = utils_1.createTimestamp();
    returnObj.MsgType = 'image';
    returnObj.MediaId = mediaId;
    const returnXml = xml_1.obj2xml({
        xml: returnObj,
    });
    return returnXml;
}
exports.imgMsg = imgMsg;
function voiceMsg(mediaId, obj) {
    const returnObj = {};
    returnObj.FromUserName = obj.ToUserName;
    returnObj.ToUserName = obj.FromUserName;
    returnObj.CreateTime = utils_1.createTimestamp();
    returnObj.MsgType = 'voice';
    returnObj.MediaId = mediaId;
    const returnXml = xml_1.obj2xml({
        xml: returnObj,
    });
    return returnXml;
}
exports.voiceMsg = voiceMsg;
//# sourceMappingURL=msgKit.js.map