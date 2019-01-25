class Response {
  constructor() {
    this.body = "";
    this.statusCode = 200;
  }

  write(data){
    this.body = data;
  }

  end(){
    return this.body;
  }
}

module.exports = { Response };
