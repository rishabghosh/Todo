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
    this.filenames = [];
    this.fileContents = {};
  }

  readdirSync() {
    return this.filenames;
  }

  readFileSync(filePath) {
    return this.fileContents[filePath];
  }

  readFile(path, callback) {
    let error;
    if (!this.fileContents[path]) {
      error = "file not found";
    }
    const content = this.fileContents[path];
    callback(error, content);
  }
}

module.exports = { Request, Response, FileSystem };
