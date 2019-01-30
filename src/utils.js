const { ROOT, DEFAULT_PAGE, SPACE } = require("./constants.js");

const getPublicPath = url => "./public" + url;

const printError = function(error) {
  if (error) console.error("error is ***", error);
};

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

const withAnchorTag = function(link, content) {
  return `<a href="${link}"> ${content} </a>`;
};

const decoder = function(text) {
  return text.replace(/\+/g, SPACE);
};

const getFilePathForUser = function(username) {
  return `./dataBase/userTodos/${username}.json`;
};

const getCurrentId = function(totalTodoLists) {
  const keyCount = Object.keys(totalTodoLists).length;
  const idNumber = keyCount + 1;
  return "list_" + idNumber;
};

module.exports = {
  getFilePath,
  writeJsonData,
  withTags,
  decoder,
  getFilePathForUser,
  withAnchorTag,
  getCurrentId
};
