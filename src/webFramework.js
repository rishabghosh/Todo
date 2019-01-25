const hasOnlyHandler = function (req, route) {
  return !(route.hasOwnProperty("method") && route.hasOwnProperty("url"));
};


//no need of giving req to has only handler, creates confusions
const isMatching = function (req, route) {
  if (hasOnlyHandler(req, route)) return true;
  return req.url === route.url && req.method === route.method;
};

class Framework {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  error(handler) {
    this.errorHandler = { handler };
  }

  handleRequest(req, res) {
    const matchingRoutes = this.routes.filter(isMatching.bind(null, req));
    matchingRoutes.push(this.errorHandler);
    const remainingRoutes = [...matchingRoutes];
    const next = function () {
      const current = remainingRoutes.shift();
      if (remainingRoutes.length === 0) return;  //change if condition (current)
      current.handler(req, res, next);
    };
    next();
  }
}

module.exports = {
  Framework,
  isMatching
};