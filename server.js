const http = require("http");

const PORT = 7000;

const server = http.createServer(function (req, res) {
  console.log("one req came");
  res.write("server responded");
  res.end();
});



server.listen(PORT, () => console.log("listening on ", PORT));