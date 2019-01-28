const fs = require("fs");
const placeholders = require("./placeholders.js");
const { sendData } = require("./requestHandlers.js");
const PREV_TODO = require("../dataBase/todoList.json");
const readArgs = require("./parser.js");

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
    .join("");
};

const renderHomepage = function(content, req, res) {
  addNewTodo(req);
  const todoTable = getTodoTable(PREV_TODO);
  const message = content.replace(placeholders.forTodoList, todoTable);
  sendData(req, res, message);
};

const renderIndex = function(content, req, res) {
  sendData(req, res, content);
};

module.exports = {
  renderHomepage,
  renderIndex
};
