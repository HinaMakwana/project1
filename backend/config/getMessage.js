const path = require('path')

module.exports.getMessage = function (key, lang) {
  let localeFile = path.join(__dirname, "locales",`${lang}.json`);
  let message = require(localeFile);
  return message[key];
};