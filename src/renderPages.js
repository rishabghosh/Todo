const fs = require("fs");
const readArgs = require("./parser.js");
const placeholders = require("./placeholders.js");
const TodoList = require("./todoList.js");
const Todo = require("./todo.js");
const USERS = require("../dataBase/users.json");
const {
  writeJsonData,
  withTags,
  getFilePathForUser,
  withAnchorTag,
  getCurrentId
} = require("./utils.js");

const {
  sendData,
  getUserName
} = require("./requestHandlers.js");

const {
  EMPTY_STRING,
  ROOT,
  POST,
  TD,
  TR
} = require("./constants.js");

const WRITER = fs.writeFile;

const getPreviousTodos = function(req) {
  const path = getFilePathForUser(getUserName(req));
  const previousTodos = fs.readFileSync(path, "utf8");
  return JSON.parse(previousTodos);
};

const addNewTodo = function(req, totalTodoLists) {
  const currentArg = readArgs(req.body);
  if (currentArg.hasOwnProperty("title")) {
    const todoList = new TodoList(currentArg.title);
    const currentId = getCurrentId(totalTodoLists);
    totalTodoLists[currentId] = todoList;
    const path = getFilePathForUser(getUserName(req));
    writeJsonData(path, totalTodoLists, WRITER);
  }
};

const getTodoTable = function(totalTodoLists) {
  const allIds = Object.keys(totalTodoLists).reverse();
  return allIds
    .map(id => {
      const currentList = totalTodoLists[id];
      const link = ROOT + id;
      const listWithLink = withAnchorTag(link, currentList.title);
      const title = withTags(TD, listWithLink);
      return withTags(TR, title);
    })
    .join(EMPTY_STRING);
};

const getNameOfUser = function(Users, username) {
  const selectedUser = Users[username];
  return selectedUser.name;
};

const renderHomepage = function(content, req, res) {
  const totalTodoLists = getPreviousTodos(req);
  if (req.method === POST) addNewTodo(req, totalTodoLists);
  const todoTable = getTodoTable(totalTodoLists);
  let message = content.replace(placeholders.forTodoLists, todoTable);
  const username = getUserName(req);
  const nameOfUser = getNameOfUser(USERS, username);
  message = message.replace(placeholders.forNameOfUser, nameOfUser);
  sendData(req, res, message);
};



const getItemTable = function(currentTodoList) {
  const items = currentTodoList.item;
  return items
    .map(item => {
      const title = withTags(TD, item);
      return withTags(TR, title);
    })
    .join(EMPTY_STRING);
};

const renderTodoItemsPage = function(content, req, res, next) {
  if (req.url.startsWith("/list_")) {
    const totalTodoLists = getPreviousTodos(req);
    const id = req.url.slice(1);
    const currentTodoList = totalTodoLists[id];
    if (req.method === POST) addNewItem(req, totalTodoLists, currentTodoList);
    const todoListTitle = currentTodoList.title;
    let message = content.replace(placeholders.forTodoListTitle, todoListTitle);
    message = message.replace(
      placeholders.forTodoItems,
      getItemTable(currentTodoList)
    );
    sendData(req, res, message);
    return;
  }
  next();
};

const addNewItem = function(req, totalTodoLists, currentTodoList) {
  const currentArg = readArgs(req.body);
  const todo = new Todo(currentTodoList);
  todo.addItems(currentArg.Title);
  const path = getFilePathForUser(getUserName(req));
  writeJsonData(path, totalTodoLists, WRITER);
};

module.exports = {
  renderHomepage,
  renderTodoItemsPage
};
