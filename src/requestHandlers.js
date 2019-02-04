const { getFilePath, getFilePathForUser, getCookie } = require("./utils.js");
const { ERROR_MESSAGE } = require("./constants.js");
const fs = require("fs");
const path = require("path");

const invalidRequest = function(req, res) {
  res.statusCode = 404;
  res.write(ERROR_MESSAGE);
  res.end();
};

const setCookie = function(res, cookie) {
  console.log(cookie);
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
  fs.readFile(filePath, (error, data) => {
    if (!error) {
      res.send(data);
      return;
    }
    invalidRequest(req, res);
  });
};

const useCookies = function(req, res) {
  const cookie = getCookie(req);
  if (cookie != undefined && cookie != "username=") {
    res.redirect("/homepage");
    return;
  }
  let filepath = `../public${req.url}`;
  if (req.url === "/") filepath = "../public/index.html";
  console.log(__dirname);
  console.log(path.join(__dirname, filepath));
  res.sendFile(path.join(__dirname, filepath));
};

const logRequest = function(req, res, next) {
  // console.log("\n------ LOGS -------\n");
  console.log("requested method ->", req.method);
  console.log("requested url -> ", req.url);
  // console.log("headers ->", JSON.stringify(req.headers, null, 2));
  // console.log("body ->", req.body);
  // console.log("\n ------ END ------- \n");
  next();
};

const homepageFiles = [
  "/",
  "/style/loginpage.css",
  "/js/loginPage.js",
  "/login",
  "/signup"
];

const handleForbiddenRequests = function(req, res, next) {
  const cookie = getCookie(req);
  if (!homepageFiles.includes(req.url)) {
    if (cookie === undefined || cookie === "username=") {
      res.redirect("/");
      return;
    }
  }
  next();
};

const checkCookieValidation = function(req, res, next) {
  const cookie = getCookie(req);
  if (cookie !== undefined && cookie !== "username=") {
    const username = cookie.split("=")[1];
    const path = getFilePathForUser(username);
    if (!fs.existsSync(path)) {
      res.setHeader("Set-Cookie", "username=");
      res.redirect("/");
      return;
    }
  }
  next();
};

module.exports = {
  readBody,
  serveFiles,
  invalidRequest,
  redirect,
  getFilePath,
  setCookie,
  logRequest,
  useCookies,
  handleForbiddenRequests,
  checkCookieValidation
};
