const fs = require("fs");

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

const readBody = function(req, res, next) {
  let content = "";
  res.statusCode = 200;
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
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

module.exports = {
  readBody,
  serveFiles,
  sendData,
  sendNotFound,
  getFilePath
};
