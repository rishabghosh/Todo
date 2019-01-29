const fs = require("fs");
const placeholders = require("./placeholders.js");
const { sendData, redirect } = require("./requestHandlers.js");
const USERS = require("../dataBase/users.json");
const CURRENT_USER = require("../dataBase/username.json");
const readArgs = require("./parser.js");
const { writeJsonData, withTags } = require("./utils.js");
const { EMPTY_STRING, ROOT, POST, TD, TR } = require("./constants.js");

const getPreviousTodos = function() {
  const username = CURRENT_USER.username;
  const previousTodos = fs.readFileSync(
    `./dataBase/user_todos/${username}.json`,
    "utf8"
  );
  return JSON.parse(previousTodos);
};

const addNewTodo = function(req, todoList) {
  const username = CURRENT_USER.username;
  const writer = fs.writeFile;
  const currentArg = readArgs(req.body);
  todoList[currentArg.Title] = [];
  writeJsonData(`./dataBase/user_todos/${username}.json`, todoList, writer);
};

const getTodoTable = function(todoList) {
  let keys = Object.keys(todoList);
  return keys
    .map(todo => {
      const title = withTags(TD, todo);
      const heading = title;
      return withTags(TR, heading);
    })
    .join(EMPTY_STRING);
};

const renderHomepage = function(content, req, res) {
  const todoList = getPreviousTodos();
  if (req.method === POST) addNewTodo(req, todoList);
  const todoTable = getTodoTable(todoList);
  let message = content.replace(placeholders.forTodoList, todoTable);
  sendData(req, res, message);
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
  const writer = fs.writeFile;
  USERS[credentials.username] = credentials;
  writeJsonData("./dataBase/users.json", USERS, writer);
  writeJsonData(
    `./dataBase/user_todos/${credentials.username}.json`,
    {},
    writer
  );
  redirect(res, ROOT);
};

const checkLoginCredentials = function(req, res) {
  const writer = fs.writeFile;
  const credentials = readArgs(req.body);
  if (hasCorrectCredentials(credentials)) {
    CURRENT_USER.username = credentials.username;
    writeJsonData("./dataBase/username.json", CURRENT_USER, writer);
    redirect(res, "/homepage");
    return;
  }
  redirect(res, ROOT);
};

module.exports = {
  renderHomepage,
  checkLoginCredentials,
  storeSignUpCredentials
};
