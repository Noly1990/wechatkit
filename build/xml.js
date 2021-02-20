'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.xml2json = exports.xml2obj = exports.obj2xml = exports.json2xml = void 0;
const convert = require("xml-js");
const removeJsonTextAttribute = function (value, parentElement) {
    try {
        const keyNo = Object.keys(parentElement._parent).length;
        const keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = value;
    }
    catch (e) {
        console.log('removeJsonTextAttribute', e);
    }
};
const options2json = {
    compact: true,
    ignoreDoctype: true,
    ignoreDeclaration: true,
    textFn: removeJsonTextAttribute,
    cdataFn: removeJsonTextAttribute,
};
const options2xml = {
    compact: true,
    fullTagEmptyElement: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,
};
function json2xml(json) {
    return convert.json2xml(json, options2xml);
}
exports.json2xml = json2xml;
function obj2xml(obj) {
    return convert.js2xml(obj, options2xml);
}
exports.obj2xml = obj2xml;
function xml2obj(xml) {
    return convert.xml2js(xml, options2json);
    ;
}
exports.xml2obj = xml2obj;
function xml2json(xml) {
    return convert.xml2json(xml, options2json);
}
exports.xml2json = xml2json;
//# sourceMappingURL=xml.js.map