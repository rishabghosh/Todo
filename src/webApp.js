const fs = require("fs");
const { ManageHandlers } = require("./webFramework.js");
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
  checkCookieValidation,
  sendData
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
  sendData(req, res, message);
};

const getTodoItems = function(req, res) {
  const totalTodoLists = getPreviousTodos(req, res);
  const todoList = req.body.split(",")[1];
  const todo = new Todo(totalTodoLists[todoList]);
  const todoItem = req.body.split(",")[0];
  todo.addItems(todoItem);
  const username = getUserName(req);
  const path = getFilePathForUser(username);
  writeJsonData(path, totalTodoLists, WRITER);
  let message = '<table id="todo_table"><tr> <td>Your Lists</td> </tr>';
  message += getItemTable(totalTodoLists[todoList]);
  sendData(req, res, message);
};

const app = function(req, res) {
  const manageHandlers = new ManageHandlers();
  manageHandlers.use(readBody);
  manageHandlers.use(logRequest);
  manageHandlers.use(checkCookieValidation);
  manageHandlers.get("/", useCookies.bind(null, fs));
  manageHandlers.use(handleForbiddenRequests);
  manageHandlers.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
  manageHandlers.post("/login", checkLoginCredentials);
  manageHandlers.post("/signup", storeSignUpCredentials);
  manageHandlers.post("/logout", logOut);
  manageHandlers.post("/todoList", getTodoList);
  manageHandlers.get(
    /\/homepage|\/homepage?/,
    renderHomepage.bind(null, HOMEPAGE_DATA)
  );
  manageHandlers.post("/todoItems", getTodoItems);
  manageHandlers.use(serveFiles.bind(null, fs));
  manageHandlers.handleRequest(req, res);
};

module.exports = { app };
