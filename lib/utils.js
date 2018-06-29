'use strict';

/**
 * 将签名对象按照参数名ASCII码从小到大排序（字典序）排序后输出字符串
 * @param {object} args
 * @returns {string}
 */
function sort2string(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * 随机字符串生产
 * @returns {string}
 */
function createNonceStr() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

/**
 * 随机时间戳生产
 * @returns {string}
 */
function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}


module.exports = {
    createTimestamp,
    createNonceStr,
    sort2string
}