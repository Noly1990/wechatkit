'use strict';

const xml2js = require('xml2js');

function json2xml(json) {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({
    xml: json,
  });
  return xml;
}


async function xml2json(xml) {
  const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

  const json = await new Promise(function(resolve, reject) {
    xmlParser.parseString(xml, function(err, data) {
      if (err) {
        console.log('xml2json error', err);
        reject(err);
      } else {
        resolve(data.xml);
      }
    });
  });

  return json;
}

module.exports = {
  json2xml,
  xml2json,
};
