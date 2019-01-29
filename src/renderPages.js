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
  const previousTodos = USERS[username]["todo"];
  return previousTodos;
};

const addNewTodo = function(req, todoList) {
  const writer = fs.writeFile;
  const currentArg = readArgs(req.body);
  if (currentArg.hasOwnProperty("Title")) {
    todoList.unshift(currentArg);
    writeJsonData("./dataBase/users.json", USERS, writer);
  }
};

const getTodoTable = function(todoList) {
  return todoList
    .map(todo => {
      const title = withTags(TD, todo.Title);
      const description = withTags(TD, todo.Description);
      const heading = title + description;
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
  writeJsonData(`./user_todos/${credentials.username}.json`, "{}", writer);
  redirect(res, ROOT);
  console.log(credentials.username);
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
