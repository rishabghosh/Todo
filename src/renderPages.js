const fs = require("fs");
const placeholders = require("./placeholders.js");
const { sendData } = require("./requestHandlers.js");
const PREV_TODO = require("../dataBase/todoList.json");

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const addNewTodo = function(req) {
  const currentTodo = readArgs(req.body);

  if (!currentTodo.hasOwnProperty("")) {
    PREV_TODO.unshift(currentTodo);
  }

  const updatedList = JSON.stringify(PREV_TODO, null, 2);
  fs.writeFile("./dataBase/todoList.json", updatedList, err =>
    console.error(err)
  );
};



const getTodoTable = function(todoList) {
  return todoList
    .map(eachTodo => {
      return `<tr> <td> ${eachTodo.Title} </td> <td> ${
        eachTodo.Description
      }</td> </tr>`;
    })
    .join("");
};

const renderHomepage = function(homepage, req, res) {
  addNewTodo(req);
  const todoTable = getTodoTable(PREV_TODO);
  const message = homepage.replace(placeholders.forTodoList, todoTable);
  sendData(req, res, message);
};

module.exports = {
  renderHomepage
};
