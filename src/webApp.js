const fs = require("fs");
const { ManageHandlers } = require("./webFramework.js");
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
  handleForbiddenRequests,
  checkCookieValidation
} = require("./requestHandlers.js");

const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS_DATA = CACHE[TODOITEMS_PATH];

const app = function(req, res) {
  const manageHandlers = new ManageHandlers();
  manageHandlers.use(readBody);
  manageHandlers.use(logRequest);
  manageHandlers.use(checkCookieValidation);
  manageHandlers.get("/", useCookies.bind(null, fs));
  manageHandlers.use(handleForbiddenRequests);
  manageHandlers.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
  manageHandlers.post("/login", checkLoginCredentials);
  manageHandlers.post("/signup", storeSignUpCredentials);
  manageHandlers.post("/logout", logOut);
  manageHandlers.get("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  manageHandlers.post("/homepage", addTodoList);
  manageHandlers.use(serveFiles.bind(null, fs));
  manageHandlers.handleRequest(req, res);
};

module.exports = { app };
