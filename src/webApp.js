const { Framework } = require("./webFramework.js");

const { renderHomepage } = require("./renderPages.js");

const { readBody, serveFiles } = require("./requestHandlers.js");

const app = function(req, res) {
  const framework = new Framework();
  framework.use(readBody);
  framework.post("/homepage.html", renderHomepage);
  framework.use(serveFiles);
  framework.handleRequest(req, res);
};

module.exports = { app };
