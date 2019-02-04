const fs = require("fs");
const express = require("express");
const { createCache } = require("./cache.js");
const storeSignUpCredentials = require("./signUp.js");
const { logOut, checkLoginCredentials } = require("./manageSessions.js");
const {
  getCurrentId,
  getUserName,
  getFilePathForUser,
  writeJsonData
} = require("./utils.js");

const TodoList = require("./todoList.js");
const Todo = require("./todo.js");

const {
  renderHomepage,
  renderTodoItemsPage,
  getPreviousTodos,
  getTodoTable,
  getItemTable
} = require("./renderPages.js");

const { HOMEPAGE_PATH, TODOITEMS_PATH } = require("./constants.js");

const {
  readBody,
  serveFiles,
  logRequest,
  useCookies,
  handleForbiddenRequests,
  checkCookieValidation
} = require("./requestHandlers.js");

const WRITER = fs.writeFileSync;
const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS_DATA = CACHE[TODOITEMS_PATH];

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

const app = express();

app.use(readBody);
app.use(logRequest);
app.use(checkCookieValidation);
app.get("/", useCookies);
app.use(handleForbiddenRequests);
app.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
app.post("/login", checkLoginCredentials);
app.post("/signup", storeSignUpCredentials);
app.post("/logout", logOut);
app.post("/todoList", getTodoList);
app.get(/\/homepage|\/homepage?/, renderHomepage.bind(null, HOMEPAGE_DATA));
app.post("/todoItems", getTodoItems);
app.use(express.static("public"));

module.exports = { app };
