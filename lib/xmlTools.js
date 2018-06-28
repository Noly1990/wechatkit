'use strict';

const convert = require('xml-js');

function nativeType(value) {
  const nValue = Number(value);
  if (!isNaN(nValue)) {
    return nValue;
  }
  const bValue = value.toLowerCase();
  if (bValue === 'true') {
    return true;
  } else if (bValue === 'false') {
    return false;
  }
  return value;
}

const removeJsonTextAttribute = function(value, parentElement) {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = nativeType(value);
  } catch (e) {
    console.log('removeJsonTextAttribute', e);
  }
};

function json2xml(json) {
  const options = {
    compact: true,
    fullTagEmptyElement: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,

  };
  return convert.json2xml(json, options);
}


function obj2xml(obj) {
  const options = {
    compact: true,
    fullTagEmptyElement: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,
  };
  return convert.js2xml(obj, options);
}

function xml2obj(xml) {
  const options = {
    compact: true,
    ignoreDoctype: true,
    ignoreDeclaration: true,
    textFn: removeJsonTextAttribute,
  };
  const result = convert.xml2js(xml, options);
  return result;
}

function xml2json(xml) {
  const options = {
    compact: true,
    ignoreDoctype: true,
    ignoreDeclaration: true,
    textFn: removeJsonTextAttribute,
  };
  const result = convert.xml2json(xml, options);
  return result;
}

module.exports = {
  json2xml,
  xml2json,
  obj2xml,
  xml2obj,
};
