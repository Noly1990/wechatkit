'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.signSHA1 = exports.signMD5 = exports.createTimestamp = exports.createNonceStr = exports.sort2string = void 0;
const crypto = require("crypto");
function sort2string(args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    const newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });
    let string = '';
    for (const k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}
exports.sort2string = sort2string;
function createNonceStr() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}
exports.createNonceStr = createNonceStr;
function createTimestamp() {
    return Math.floor(Date.now() / 1000) + '';
}
exports.createTimestamp = createTimestamp;
function signMD5(str) {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}
exports.signMD5 = signMD5;
function signSHA1(str) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(str, 'utf-8');
    return sha1.digest('hex');
}
exports.signSHA1 = signSHA1;
//# sourceMappingURL=utils.js.map