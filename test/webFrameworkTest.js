/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;
const { ManageHandlers, isMatching } = require("../src/webFramework.js");

describe("ManageHandlers", () => {
  const sum = (a, b) => a + b;
  it("use method should push the handler into routes", () => {
    const manageHandlers = new ManageHandlers();
    manageHandlers.use(sum);
    assert.deepStrictEqual(manageHandlers.routes, [{ handler: sum }]);
  });

  it("get method should push method as GET,url and handler into routes", () => {
    const url = "/";
    const manageHandlers = new ManageHandlers();
    const expectedOutput = [{ method: "GET", url: "/", handler: sum }];
    manageHandlers.get(url, sum);
    assert.deepStrictEqual(manageHandlers.routes, expectedOutput);
  });

  it("post method should push method as POST, url and handler into routes", () => {
    const url = "/homepage";
    const manageHandlers = new ManageHandlers();
    const expectedOutput = [{ method: "POST", url: "/homepage", handler: sum }];
    manageHandlers.post(url, sum);
    assert.deepStrictEqual(manageHandlers.routes, expectedOutput);
  });

  it("requestHandler method should invoke functions of matching routes with req and res", () => {
    const asserter = (req, res, next) => {
      assert.deepStrictEqual({ req, res }, { req: "request", res: "response" });
      next();
    };
    const callNext = (a, b, next) => {
      next();
    };

    const manageHandlers = new ManageHandlers();
    manageHandlers.use(asserter);
    manageHandlers.use(callNext);
    manageHandlers.handleRequest("request", "response");
  });
});

describe("isMatching", () => {
  it("should return true if url and method are same for request and route", () => {
    const request = { url: "/", method: "POST" };
    const route = { url: "/", method: "POST", handler: () => {} };
    const expectedOutput = true;
    const actualOutput = isMatching(request, route);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should return false if url is same but method is different for request and route", () => {
    const request = { url: "/", method: "POST" };
    const route = { url: "/", method: "GET", handler: () => {} };
    const expectedOutput = false;
    const actualOutput = isMatching(request, route);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should return false if url is different but method is same for request and route", () => {
    const request = { url: "/login", method: "POST" };
    const route = { url: "/", method: "POST", handler: () => {} };
    const expectedOutput = false;
    const actualOutput = isMatching(request, route);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should return false if url and method are different for request and route", () => {
    const request = { url: "/login", method: "POST" };
    const route = { url: "/", method: "GET", handler: () => {} };
    const expectedOutput = false;
    const actualOutput = isMatching(request, route);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should return true if route has only handler", () => {
    const route = { handler: () => {} };
    const expectedOutput = true;
    const actualOutput = isMatching(null, route);
    assert.strictEqual(actualOutput, expectedOutput);
  });

});
