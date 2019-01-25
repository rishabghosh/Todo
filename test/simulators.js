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

module.exports = { Request, Response };
