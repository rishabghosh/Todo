const fs = require("fs");
const { Framework } = require("./webFramework.js");
const { renderHomepage } = require("./renderPages.js");
const { readBody, serveFiles } = require("./requestHandlers.js");
const { createCache } = require("./cache.js");

const CACHE = createCache(fs);
const HOMEPAGE = "./public/homepage.html";
const HOMEPAGE_DATA = CACHE[HOMEPAGE];


const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.post("/homepage.html", renderHomepage.bind(null, HOMEPAGE_DATA));
  framework.use(serveFiles);
  framework.handleRequest(req, res);
};

module.exports = { app };
