const fs = require("fs");
const placeholders = require("./placeholders.js");
const { sendData, redirect } = require("./requestHandlers.js");
const PREV_TODO = require("../dataBase/todoList.json");
const USERS = require("../dataBase/users.json");
const readArgs = require("./parser.js");
const { EMPTY_STRING, ROOT, POST } = require("./constants.js");



const addNewTodo = function(req) {
  const currentArg = readArgs(req.body);
  if (currentArg.hasOwnProperty("Title")) {
    PREV_TODO.unshift(currentArg);
    const updatedList = JSON.stringify(PREV_TODO, null, 2);
    fs.writeFile("./dataBase/todoList.json", updatedList, err =>
      console.error(err)
    );
  }
};

const getTodoTable = function(todoList) {
  return todoList
    .map(todo => {
      return `<tr> <td> ${todo.Title} </td> <td> ${
        todo.Description
      }</td> </tr>`;
    })
    .join(EMPTY_STRING);
};

const renderHomepage = function(content, req, res) {
  if (req.method === POST) addNewTodo(req);
  const todoTable = getTodoTable(PREV_TODO);
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

const checkLoginCredentials = function(req, res) {
  const credentials = readArgs(req.body);
  if (hasCorrectCredentials(credentials)) {
    redirect(res, "/homepage");
    return;
  }
  redirect(res, ROOT);
};

module.exports = {
  renderHomepage,
  checkLoginCredentials
};
