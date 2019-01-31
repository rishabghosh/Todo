const { getFilePath } = require("./utils.js");
const { ERROR_MESSAGE } = require("./constants.js");

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

const setCookie = function(res, cookie) {
  res.setHeader("Set-Cookie", "username=" + cookie);
};

const redirect = function(res, location) {
  res.statusCode = 301;
  res.setHeader("Location", location);
  res.end();
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

const useCookies = function(fs, req, res) {
  const cookie = req.headers.cookie;
  if (cookie != undefined && cookie != "username=") {
    // renderHomepage(HOMEPAGE_DATA, req, res);
    redirect(res, "/homepage");
    return;
  }
  serveFiles(fs, req, res);
};

const logRequest = function(req, res, next) {
  console.log("\n------ LOGS -------\n");
  console.log("requested method ->", req.method);
  console.log("requested url -> ", req.url);
  console.log("headers ->", JSON.stringify(req.headers, null, 2));
  console.log("body ->", req.body);
  console.log("\n ------ END ------- \n");
  next();
};

module.exports = {
  readBody,
  serveFiles,
  sendData,
  invalidRequest,
  redirect,
  getFilePath,
  setCookie,
  logRequest,
  useCookies
};
