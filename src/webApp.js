const fs = require("fs");
const { Framework } = require("./webFramework.js");
//const app = new Framework

const sendData = function(req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const sendNotFound = function(req, res) {
  res.statusCode = 404;
  res.write("Not Found");
  res.end();
};

const getFilePath = function(url) {
  let filePath = "./public" + url;
  if (url === "/") {
    filePath = "./public/index.html";
  }
  return filePath;
};

const serveFiles = function(req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (error, data) => {
    if (!error) {
      sendData(req, res, data);
    } else {
      sendNotFound(req, res);
    }
  });
};

const readBody = function(req, res, next) {
  let content = "";
  res.statusCode = 200;
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

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

const addNewTodo = function(req, res) {
  const currentTodo = readArgs(req.body);
  PREV_TODO.push(currentTodo);
  fs.writeFile("./dataBase/todoList.json", JSON.stringify(PREV_TODO), err =>
    console.log(err)
  );
};

const getTodoTable = function(todoList) {
  console.log(todoList);
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
    const message = html.replace("<!--todo_lists-->", getTodoTable(PREV_TODO));
    // console.log(message);
    sendData(req, res, message);
  });
};

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.post("/homepage.html", renderHomepage);
  framework.use(serveFiles);
  framework.handleRequest(req, res);
};

module.exports = {
  app,
  sendData,
  sendNotFound,
  getFilePath
};
