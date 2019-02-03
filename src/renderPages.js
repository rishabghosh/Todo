const fs = require("fs");
const placeholders = require("./placeholders.js");
const USERS = require("../dataBase/users.json");
const { sendData } = require("./requestHandlers.js");
const { EMPTY_STRING, ROOT,  TD, TR } = require("./constants.js");

const {
  withTag,
  getFilePathForUser,
  withAnchorTag,
  getUserName,
  getNameOfUser
} = require("./utils.js");


const getPreviousTodos = function(req) {
  const username = getUserName(req);
  const path = getFilePathForUser(username);
  const previousTodos = fs.readFileSync(path, "utf8");
  return JSON.parse(previousTodos);
};

const getTodoTable = function(totalTodoLists) {
  const allIds = Object.keys(totalTodoLists).reverse();
  return allIds
    .map(id => {
      const currentList = totalTodoLists[id];
      const link = ROOT + id;
      const listWithLink = withAnchorTag(link, currentList.title);
      const title = withTag(TD, listWithLink);
      return withTag(TR, title);
    })
    .join(EMPTY_STRING);
};

const renderHomepage = function(content, req, res) {
  const totalTodoLists = getPreviousTodos(req, res);
  const username = getUserName(req);
  const nameOfUser = getNameOfUser(USERS, username);
  const todoTable = getTodoTable(totalTodoLists);
  let message = content.replace(placeholders.forTodoLists, todoTable);
  message = message.replace(placeholders.forNameOfUser, nameOfUser);
  sendData(req, res, message);
};

const getItemTable = function(currentTodoList) {
  const items = currentTodoList.item;
  return items
    .map(item => {
      const title = withTag(TD, item);
      return withTag(TR, title);
    })
    .join(EMPTY_STRING);
};

const renderTodoItemsPage = function(content, req, res, next) {
  if (req.url.startsWith("/list_")) {
    const totalTodoLists = getPreviousTodos(req, res);
    const allLists = Object.keys(totalTodoLists);
    const id = req.url.slice(1);
    if (allLists.includes(id)) {
      const currentTodoList = totalTodoLists[id];
      const todoListTitle = currentTodoList.title;
      let message = content.replace(
        placeholders.forTodoListTitle,
        todoListTitle
      );
      message = message.replace(
        placeholders.forTodoItems,
        getItemTable(currentTodoList)
      );
      sendData(req, res, message);
      return;
    }
  }
  next();
};

module.exports = {
  renderHomepage,
  renderTodoItemsPage,
  getPreviousTodos,
  getTodoTable,
  getItemTable
};
