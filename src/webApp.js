const fs = require("fs");
const { Framework } = require("./webFramework.js");

const {
  renderHomepage,
  checkLoginCredentials,
  storeSignUpCredentials,
  logOut,
  renderTodoItemsPage
} = require("./renderPages.js");

const { readBody, serveFiles } = require("./requestHandlers.js");

const { createCache } = require("./cache.js");
const { HOMEPAGE_PATH } = require("./constants.js");

const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS = "./public/todo_items.html";
const TODOITEMS_DATA = CACHE[TODOITEMS];

const useCookies = function(req, res) {
  let cookie = req.headers["cookie"];
  console.log(cookie);
  if (cookie != undefined && cookie != 'username=') {
    renderHomepage(HOMEPAGE_DATA, req, res);
    return;
  }
  serveFiles(fs, req, res);
};

const logRequest = function(req, res, next) {
  console.log(req.url);
  console.log(req.headers);
  next();
};

const app = function(req, res) {
  const framework = new Framework();
  framework.use(logRequest);
  framework.use(readBody);
  framework.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
  framework.post("/login", checkLoginCredentials);
  framework.post("/signup", storeSignUpCredentials);
  framework.post("/logout", logOut);
  framework.get("/", useCookies);
  framework.get("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.post("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.use(serveFiles.bind(null, fs));
  framework.handleRequest(req, res);
};

module.exports = { app };
