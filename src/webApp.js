const fs = require("fs");
const { Framework } = require("./webFramework.js");
//const app = new Framework

const sendData = function (req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const sendNotFound = function (req, res) {
  res.statusCode = 404;
  res.end();
}

const getFilePath = function (url) {
  let filePath = "./public" + url;
  if (url === "/") { filePath = "./public/index.html"; }
  return filePath;
};

const serveFiles = function (req, res) {
  const filePath = getFilePath(req.url)
  fs.readFile(filePath, (error, data) => {
    if (!error) {
      sendData(req, res, data);
    } else {
      sendNotFound(req, res);
    }
  });
};

const app = function (req, res) {
  const framework = new Framework();
  framework.use(serveFiles);
  framework.handleRequest(req, res);


};

module.exports = app;