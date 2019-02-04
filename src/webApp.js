const fs = require("fs");
const express = require("express");
const { createCache } = require("./cache.js");
const storeSignUpCredentials = require("./signUp.js");
const { logOut, checkLoginCredentials } = require("./manageSessions.js");

const {
  renderHomepage,
  renderTodoItemsPage,
  getTodoItems,
  getTodoList
} = require("./renderPages.js");

const { HOMEPAGE_PATH, TODOITEMS_PATH } = require("./constants.js");

const {
  readBody,
  logRequest,
  useCookies,
  handleForbiddenRequests,
  checkCookieValidation
} = require("./requestHandlers.js");

const CACHE = createCache(fs);
const HOMEPAGE_DATA = CACHE[HOMEPAGE_PATH];
const TODOITEMS_DATA = CACHE[TODOITEMS_PATH];

const app = express();

app.use(readBody);
app.use(logRequest);
app.use(checkCookieValidation);
app.get("/", useCookies);
app.use(handleForbiddenRequests);
app.use(renderTodoItemsPage.bind(null, TODOITEMS_DATA));
app.post("/login", checkLoginCredentials);
app.post("/signup", storeSignUpCredentials);
app.post("/logout", logOut);
app.post("/todoList", getTodoList);
app.get(/\/homepage|\/homepage?/, renderHomepage.bind(null, HOMEPAGE_DATA));
app.post("/todoItems", getTodoItems);
app.use(express.static("public"));

module.exports = { app };
