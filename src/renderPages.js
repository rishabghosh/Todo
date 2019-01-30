const fs = require("fs");
const placeholders = require("./placeholders.js");
const { sendData, redirect } = require("./requestHandlers.js");
const USERS = require("../dataBase/users.json");
const CURRENT_USER = require("../dataBase/username.json");
const readArgs = require("./parser.js");
const { writeJsonData, withTags, getFilePathForUser } = require("./utils.js");
const TodoList = require("./todoList.js");

const {
  EMPTY_STRING,
  EMPTY_OBJECT,
  ROOT,
  POST,
  TD,
  TR,
  USERNAME_JSON_PATH,
  USERS_JSON_PATH
} = require("./constants.js");

const WRITER = fs.writeFile;

const getCurrentId = function(previousTodoList) {
  const keyCount = Object.keys(previousTodoList).length;
  const idNumber = keyCount + 1;
  return "list_" + idNumber;
};

const getPreviousTodos = function() {
  const path = getFilePathForUser(CURRENT_USER.username);
  const previousTodos = fs.readFileSync(path, "utf8");
  return JSON.parse(previousTodos);
};

const addNewTodo = function(req, previousTodoList) {
  const currentArg = readArgs(req.body);
  const todoList = new TodoList(currentArg.Title);
  const currentId = getCurrentId(previousTodoList);
  previousTodoList[currentId] = todoList;
  const path = getFilePathForUser(CURRENT_USER.username);
  writeJsonData(path, previousTodoList, WRITER);
};

const getTodoTable = function(previousTodoList) {
  const ids = Object.keys(previousTodoList).reverse();
  return ids
    .map(id => {
      const listWithLink = `<a href="/${id}">${
        previousTodoList[id]["title"]
      }</a>`;
      const title = withTags(TD, listWithLink);
      return withTags(TR, title);
    })
    .join(EMPTY_STRING);
};

const renderHomepage = function(content, req, res) {
  const previousTodoList = getPreviousTodos();
  if (req.method === POST) addNewTodo(req, previousTodoList);
  const todoTable = getTodoTable(previousTodoList);
  const message = content.replace(placeholders.forTodoList, todoTable);
  sendData(req, res, message);
};

const logOut = function(req, res) {
  CURRENT_USER.username = EMPTY_STRING;
  writeJsonData(USERNAME_JSON_PATH, CURRENT_USER, WRITER);
  redirect(res, ROOT);
};

const hasCorrectCredentials = function(credentials) {
  const givenUsername = credentials.username;
  const givenPassword = credentials.password;
  return (
    USERS.hasOwnProperty(givenUsername) &&
    USERS[givenUsername]["password"] === givenPassword
  );
};

const storeSignUpCredentials = function(req, res) {
  const credentials = readArgs(req.body);
  const path = getFilePathForUser(credentials.username);
  USERS[credentials.username] = credentials;
  writeJsonData(USERS_JSON_PATH, USERS, WRITER);
  writeJsonData(path, EMPTY_OBJECT, WRITER);
  redirect(res, ROOT);
};

const checkLoginCredentials = function(req, res) {
  const credentials = readArgs(req.body);
  if (hasCorrectCredentials(credentials)) {
    CURRENT_USER.username = credentials.username;
    writeJsonData(USERNAME_JSON_PATH, CURRENT_USER, WRITER);
    redirect(res, "/homepage");
    return;
  }
  redirect(res, ROOT);
};

const renderTodoItemsPage = function(content, req, res, next) {
  if (req.url.startsWith("/list_")) {
    const previousTodoList = getPreviousTodos();
    const id = req.url.slice(1);

    const todoListTitle = previousTodoList[id]["title"];
    const message = content.replace("<!--todo_list_tilte-->", todoListTitle);
    sendData(req, res, message);
    return;
  }
  next();
};

module.exports = {
  renderHomepage,
  checkLoginCredentials,
  storeSignUpCredentials,
  logOut,
  renderTodoItemsPage
};
