class Response {
  constructor() {
    this.body = "";
    this.statusCode = 200;
  }

  write(data) {
    this.body = data;
  }

  end() {
    return this.body;
  }
}

class Request {
  constructor() {
    this.body = "";
    this.receivedData = "";
  }

  on(event, callback) {
    if (event === "data") callback(this.receivedData);
    if (event === "end") callback();
  }
}

class FileSystem {
  constructor() {
    this.filenames = ["index.html", "homepage.html", "js", "style"];
    this.htmlFiles = {
      "./public/index.html": "0\n1\n2\n3\n4",
      "./public/homepage.html": "abcd"
    };
  }

  readdirSync(path) {
    return this.filenames;
  }

  readFileSync(filePath, encodeing){
    return this.htmlFiles[filePath];
  }
}

module.exports = { Request, Response, FileSystem };
