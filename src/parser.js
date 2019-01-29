const { decoder } = require("./utils.js");

const readArgs = function(text) {
  let args = {};
  const decodedText = decoder(text);
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  decodedText
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

module.exports = readArgs;
