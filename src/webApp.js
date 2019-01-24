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

const addNewTodo = function(req, res) {
  const currentTodo = readArgs(req.body);
  const todoList = fs.readFileSync("./dataBase/todoList.json", "utf8");
  const prevTodo = JSON.parse(todoList);
  prevTodo.push(currentTodo);
  fs.writeFile("./dataBase/todoList.json", JSON.stringify(prevTodo), err => console.log(err));
};



const renderHomepage = function(req, res) {
  fs.readFile("./public/homepage.html", (err, data) => {
    const html = data.toString();
    const message = html.replace("<!--todo_lists-->", "hi this is replaced");
    addNewTodo(req, res);
    sendData(req, res, html);
  });
};

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.post("/homepage.html", renderHomepage);
  framework.use(serveFiles);
  framework.handleRequest(req, res);
};

module.exports = app;
