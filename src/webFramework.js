const hasOnlyHandler = function(route) {
  //how about !route["method"] && !route["url"]
  return !route.hasOwnProperty("method") && !route.hasOwnProperty("url");
};

const isMatching = function(req, route) {
  if (hasOnlyHandler(route)) return true;
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

  handleRequest(req, res) {
    const matchingRoutes = this.routes.filter(isMatching.bind(null, req));
    const remainingRoutes = [...matchingRoutes];

    const next = function() {
      if (remainingRoutes.length === 0) return;
      const current = remainingRoutes.shift();
      current.handler(req, res, next);
    };

    next();
  }
}

module.exports = {
  Framework,
  isMatching
};
