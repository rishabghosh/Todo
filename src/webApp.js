const fs = require("fs");
const { Framework } = require("./webFramework.js");
const { logOut, checkLoginCredentials } = require("./manageSessions.js");
const storeSignUpCredentials = require("./signUp.js");
const { renderHomepage, renderTodoItemsPage } = require("./renderPages.js");

const { readBody, serveFiles } = require("./requestHandlers.js");

const { createCache } = require("./cache.js");
const { HOMEPAGE_PATH } = require("./constants.js");

const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS = "./public/todo_items.html";
const TODOITEMS_DATA = CACHE[TODOITEMS];

const useCookies = function(req, res) {
  const cookie = req.headers.cookie;
  if (cookie != undefined && cookie != "username=") {
    renderHomepage(HOMEPAGE_DATA, req, res);
    // redirect(res, "/homepage");
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

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.use(logRequest);
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
