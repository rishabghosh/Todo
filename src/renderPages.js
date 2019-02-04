const fs = require("fs");
const placeholders = require("./placeholders.js");
const USERS = require("../dataBase/users.json");
const { EMPTY_STRING, ROOT, TD, TR } = require("./constants.js");
const WRITER = fs.writeFileSync;
const TodoList = require("./todoList.js");
const Todo = require("./todo.js");

const {
  withTag,
  getFilePathForUser,
  withAnchorTag,
  getUserName,
  getNameOfUser,
  getCurrentId,
  writeJsonData
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
  res.send(message);
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
      res.send(message);
      return;
    }
  }
  next();
};

const getTodoList = function(req, res) {
  const newTodo = JSON.parse(req.body);
  const todoList = new TodoList(newTodo.list);
  const totalTodoLists = getPreviousTodos(req, res);
  const currentId = getCurrentId(totalTodoLists);
  totalTodoLists[currentId] = todoList;
  const username = getUserName(req);
  const path = getFilePathForUser(username);
  writeJsonData(path, totalTodoLists, WRITER);
  let message = '<table id="todo_table"><tr> <td>Your Lists</td> </tr>';
  message += getTodoTable(totalTodoLists);
  res.send(message);
};

const getTodoItems = function(req, res) {
  const totalTodoLists = getPreviousTodos(req, res);
  const listAndListId = JSON.parse(req.body);
  const todoListId = listAndListId.listId;
  const todo = new Todo(totalTodoLists[todoListId]);
  const todoItem = listAndListId.list;
  todo.addItems(todoItem);
  const username = getUserName(req);
  const path = getFilePathForUser(username);
  writeJsonData(path, totalTodoLists, WRITER);
  let message = '<table id="todo_table"><tr> <td>Your Items</td> </tr>';
  message += getItemTable(totalTodoLists[todoListId]);
  res.send(message);
};

module.exports = {
  renderHomepage,
  renderTodoItemsPage,
  getPreviousTodos,
  getTodoTable,
  getItemTable,
  getTodoItems,
  getTodoList
};
