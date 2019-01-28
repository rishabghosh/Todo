const sendData = function(req, res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const invalidRequest = function(req, res) {
  res.statusCode = 404;
  res.write("Invalid Request");
  res.end();
};

const redirect = function(res, location) {
  res.statusCode = 301;
  res.setHeader("Location", location);
  res.end();
};

const getFilePath = function(url) {
  return url === "/" ? "./public/index.html" : "./public" + url;
};

const readBody = function(req, res, next) {
  let content = "";
  res.statusCode = 200;
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const serveFiles = function(fs, req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (error, data) => {
    if (!error) {
      sendData(req, res, data);
    } else {
      invalidRequest(req, res);
    }
  });
};

module.exports = {
  readBody,
  serveFiles,
  sendData,
  invalidRequest,
  redirect,
  getFilePath
};
