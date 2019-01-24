/* eslint-env mocha */

const assert = require("assert");
const {
  Framework,
  isMatching
} = require("../src/webFramework.js");



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

  it("error method should assign handler in object to errorHandler", () => {
    const framework = new Framework();
    const expectedOutput = { handler: sum };
    framework.error(sum);
    assert.deepStrictEqual(framework.errorHandler, expectedOutput);
  });

  /*
  **  should add routes..
  **  should mock req and res
  **  +
  */
  it.skip("post method should push method as POST, url and handler into routes", () => {
    const url = "/homepage";
    const framework = new Framework();
    const expectedOutput = [{ method: "POST", url: "/homepage", handler: sum }];
    assert.deepStrictEqual(framework.routes, expectedOutput);
  });

});

