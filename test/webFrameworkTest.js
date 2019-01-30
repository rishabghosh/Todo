/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;
const { Framework, isMatching } = require("../src/webFramework.js");

describe("Framework", () => {
  const sum = (a, b) => a + b;
  it("use method should push the handler into routes", () => {
    const framework = new Framework();
    framework.use(sum);
    assert.deepStrictEqual(framework.routes, [{ handler: sum }]);
  });

  it("get method should push method as GET,url and handler into routes", () => {
    const url = "/";
    const framework = new Framework();
    const expectedOutput = [{ method: "GET", url: "/", handler: sum }];
    framework.get(url, sum);
    assert.deepStrictEqual(framework.routes, expectedOutput);
  });

  it("post method should push method as POST, url and handler into routes", () => {
    const url = "/homepage";
    const framework = new Framework();
    const expectedOutput = [{ method: "POST", url: "/homepage", handler: sum }];
    framework.post(url, sum);
    assert.deepStrictEqual(framework.routes, expectedOutput);
  });

  it("requestHandler method should invoke functions of matching routes with req and res", () => {
    const asserter = (req, res, next) => {
      assert.deepStrictEqual({ req, res }, { req: "request", res: "response" });
      next();
    };
    const callNext = (a, b, next) => {
      next();
    };

    const framework = new Framework();
    framework.use(asserter);
    framework.use(callNext);
    framework.handleRequest("request", "response");
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
