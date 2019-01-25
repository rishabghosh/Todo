const http = require("http");
const { app } = require("./src/webApp.js");

const PORT = 7000;

const server = http.createServer(app);

server.listen(PORT, () => console.log("listening on ", PORT));
