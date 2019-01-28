const { ERROR_MESSAGE, ROOT, DEFAULT_PAGE } = require("./constants.js");

const sendData = function(req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const invalidRequest = function(req, res) {
  res.statusCode = 404;
  res.write(ERROR_MESSAGE);
  res.end();
};

const redirect = function(res, location) {
  res.statusCode = 301;
  res.setHeader("Location", location);
  res.end();
};

const getFilePath = function(url) {
  return url === ROOT ? DEFAULT_PAGE : "./public" + url;
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

const serveFiles = function(fs, req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (error, data) => {
    if (!error) {
      sendData(req, res, data);
      return;
    }
    invalidRequest(req, res);
  });
};

module.exports = {
  readBody,
  serveFiles,
  sendData,
  invalidRequest,
  redirect,
  getFilePath
};
