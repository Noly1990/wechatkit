"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAppPay = exports.signWXPay = exports.normalSigh = void 0;
const utils_1 = require("./utils");
const xml_1 = require("./xml");
function normalSigh(signInfos, mchKey) {
    const nonce_str = utils_1.createNonceStr();
    let signObj = Object.assign(signInfos, {
        nonce_str,
    });
    const str1 = utils_1.sort2string(signObj);
    const str2 = str1 + `&key=${mchKey}`;
    const sign = utils_1.signMD5(str2).toUpperCase();
    signObj = Object.assign(signObj, {
        sign,
    });
    return xml_1.obj2xml({ xml: signObj });
}
exports.normalSigh = normalSigh;
function signWXPay(prepay_id, appId, mchKey) {
    const nonceStr = utils_1.createNonceStr();
    const timestamp = utils_1.createTimestamp();
    const signType = 'MD5';
    const ipackage = 'prepay_id=' + prepay_id;
    const stringA = `appId=${appId}&nonceStr=${nonceStr}&package=${ipackage}&signType=${signType}&timeStamp=${timestamp}`;
    const stringSignTemp = stringA + `&key=${mchKey}`;
    const paySign = utils_1.signMD5(stringSignTemp).toUpperCase();
    return {
        nonceStr,
        timestamp,
        package: ipackage,
        signType,
        paySign,
    };
}
exports.signWXPay = signWXPay;
function signAppPay(prepay_id, appId, mchId, mchKey) {
    const noncestr = utils_1.createNonceStr();
    const timestamp = utils_1.createTimestamp();
    const ipackage = 'Sign=WXPay';
    const stringA = `appid=${appId}&noncestr=${noncestr}&package=${ipackage}&partnerid=${mchId}&prepayid=${prepay_id}&timestamp=${timestamp}`;
    const stringSignTemp = stringA + `&key=${mchKey}`;
    const sign = utils_1.signMD5(stringSignTemp).toUpperCase();
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
exports.signAppPay = signAppPay;
//# sourceMappingURL=wxSign.js.map