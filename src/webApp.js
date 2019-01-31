const fs = require("fs");
const { Framework } = require("./webFramework.js");
const { createCache } = require("./cache.js");
const storeSignUpCredentials = require("./signUp.js");
const { logOut, checkLoginCredentials } = require("./manageSessions.js");
const {
  renderHomepage,
  renderTodoItemsPage,
  addTodoList
} = require("./renderPages.js");
const { HOMEPAGE_PATH, TODOITEMS_PATH } = require("./constants.js");

const {
  readBody,
  serveFiles,
  logRequest,
  useCookies,
  handleForbiddenRequests
} = require("./requestHandlers.js");

const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS_DATA = CACHE[TODOITEMS_PATH];

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.use(logRequest);
  framework.get("/", useCookies.bind(null, fs));
  framework.use(handleForbiddenRequests);
  framework.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
  framework.post("/login", checkLoginCredentials);
  framework.post("/signup", storeSignUpCredentials);
  framework.post("/logout", logOut);
  framework.get("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.post("/homepage", addTodoList);
  framework.use(serveFiles.bind(null, fs));
  framework.handleRequest(req, res);
};

module.exports = { app };
