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

const {
  renderHomepage,
  renderTodoItemsPage,
  getPreviousTodos,
  getTodoTable
} = require("./renderPages.js");
const { HOMEPAGE_PATH, TODOITEMS_PATH } = require("./constants.js");

const {
  readBody,
  serveFiles,
  logRequest,
  useCookies,
  handleForbiddenRequests,
  checkCookieValidation,
  redirect,
  sendData
} = require("./requestHandlers.js");

const WRITER = fs.writeFileSync;
const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS_DATA = CACHE[TODOITEMS_PATH];

const getTodoList = function(req, res) {
  const newTodo = req.body;
  const todoList = new TodoList(newTodo);
  const totalTodoLists = getPreviousTodos(req, res);
  const currentId = getCurrentId(totalTodoLists);
  totalTodoLists[currentId] = todoList;
  const username = getUserName(req);
  const path = getFilePathForUser(username);
  console.log("*********", totalTodoLists);
  writeJsonData(path, totalTodoLists, WRITER);
  console.log(totalTodoLists);
  let message = "<table id=\"todo_table\"><tr> <td>Your Lists</td> </tr>";
  message += getTodoTable(totalTodoLists);
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
  manageHandlers.get("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  manageHandlers.post("/getTodoList", getTodoList);
  manageHandlers.post("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  manageHandlers.use(serveFiles.bind(null, fs));
  manageHandlers.handleRequest(req, res);
};

module.exports = { app };
