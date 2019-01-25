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
    this.chunk = "some data";
  }

  on(event, callback) {
    if (event === "data") callback(this.chunk);
    if (event === "end") callback();
  }
}

module.exports = { Request, Response };
