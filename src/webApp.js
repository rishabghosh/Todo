const fs = require("fs");
const { Framework } = require("./webFramework.js");
const { renderHomepage, checkLoginCredentials } = require("./renderPages.js");
const { readBody, serveFiles } = require("./requestHandlers.js");
const { createCache } = require("./cache.js");

const CACHE = createCache(fs);
const HOMEPAGE = "./public/homepage.html"; // could be a better name?
const HOMEPAGE_DATA = CACHE[HOMEPAGE];

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.post("/login", checkLoginCredentials);
  framework.get("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.post("/homepage", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.use(serveFiles.bind(null, fs));
  framework.handleRequest(req, res);
};

module.exports = { app };
