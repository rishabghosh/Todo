/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { Request, Response, FileSystem } = require("./simulators.js");

const {
  sendData,
  invalidRequest,
  readBody,
  serveFiles
} = require("../src/requestHandlers.js");


describe("sendData", () => {
  const req = null;

  it("should not modify the response body if sendData is not invoked", () => {
    const res = new Response();
    const actualOutput = res.body;
    const expectedOutput = "";
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should provided data to the response body if sendData is invoked", () => {
    const res = new Response();
    const data = "some data";
    sendData(req, res, data);
    const actualOutput = res.body;
    const expectedOutput = "some data";
    assert.strictEqual(actualOutput, expectedOutput);
  });
});

describe("invalidRequest", () => {
  const req = null;
  
  it("should modify the response body if sendNotFound is invoked", () => {
    const res = new Response();
    invalidRequest(req, res);
    const actualOutput = res.body;
    const expectedOutput = "Invalid Request";
    assert.strictEqual(actualOutput, expectedOutput);
  });
});


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

describe("serveFiles", () => {
  const fs = new FileSystem();
  (fs.fileContents["./public/index.html"] = "0\n1\n2\n3\n4"),
  (fs.fileContents["./public/homepage.html"] = "abcd");

  it("should serve a file if exists", () => {
    const res = new Response();
    const req = new Request();
    req.url = "/homepage.html";

    serveFiles(fs, req, res);
    const actualOutput = res.body;
    const expectedOutput = "abcd";

    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should send error if file doesnot exist", () => {
    const res = new Response();
    const req = new Request();
    req.url = "/badfile";

    serveFiles(fs, req, res);
    const actualOutput = res.body;
    const expectedOutput = "Invalid Request";

    assert.strictEqual(actualOutput, expectedOutput);
  });
});
