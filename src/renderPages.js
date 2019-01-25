const fs = require("fs");

const placeholders = require("./placeholders.js");

const { sendData } = require("./requestHandlers.js");


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

const readPrevTodos = function() {
  const todoList = fs.readFileSync("./dataBase/todoList.json", "utf8");
  return JSON.parse(todoList);
};

const PREV_TODO = readPrevTodos();

const addNewTodo = function(req) {
  const currentTodo = readArgs(req.body);
  PREV_TODO.unshift(currentTodo);
  fs.writeFile("./dataBase/todoList.json", JSON.stringify(PREV_TODO), err =>
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

const renderHomepage = function(req, res) {
  fs.readFile("./public/homepage.html", (err, data) => {
    addNewTodo(req, res);
    const html = data.toString();
    const todoTable = getTodoTable(PREV_TODO);
    const message = html.replace(placeholders.forTodoList, todoTable);
    sendData(req, res, message);
  });
};

module.exports = {
  renderHomepage
};
