const { ROOT, DEFAULT_PAGE } = require("./constants.js");

const getPublicPath = url => "./public" + url;
const printError = error => console.error(error);

const getFilePath = function(url) {
  return url === ROOT ? DEFAULT_PAGE : getPublicPath(url);
};

const writeJsonData = function(path, data, writer) {
  const stringifiedData = JSON.stringify(data, null, 2);
  writer(path, stringifiedData, printError);
};

const withTags = function(tag, content) {
  return `<${tag}> ${content} </${tag}>`;
};

const filterDescription = description => description.split("+").join(" ");

module.exports = {
  getFilePath,
  writeJsonData,
  withTags,
  filterDescription
};
