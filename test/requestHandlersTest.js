/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { Request, Response } = require("./simulators.js");

const { readBody } = require("../src/requestHandlers.js");

describe("readBody", () => {
  it("should read chunks form server and call the next functions", () => {
    const res = new Response();
    const req = new Request();
    req.receivedData = "some data";
    const expectedOutput = "some data";

    const asserter = function() {
      const actualOutput = req.body;
      assert.strictEqual(actualOutput, expectedOutput);
    };

    readBody(req, res, asserter);
  });
});
