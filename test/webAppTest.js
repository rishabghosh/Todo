/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { sendData, sendNotFound, getFilePath } = require("../src/webApp.js");

const res = {
  body: "",
  statusCode: 200,
  write: function(data) {
    this.body = data;
  },
  end: () => this.body
};

const req = {};

describe("sendData", () => {
  it("should not modify the response body if sendData is not invoked", () => {
    const actualOutput = res.body;
    const expectedOutput = "";
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should provided data to the response body if sendData is invoked", () => {
    const data = "some data";
    sendData(req, res, data);
    const actualOutput = res.body;
    const expectedOutput = "some data";
    assert.strictEqual(actualOutput, expectedOutput);
  });
});

describe("sendNotFound", () => {
  it("should modify the response body if sendNotFound is invoked", () => {
    sendNotFound(req, res);
    const actualOutput = res.body;
    const expectedOutput = "Not Found";
    assert.strictEqual(actualOutput, expectedOutput);
  });
});

describe("getFilePath", () => {
  it("should get a equivalent file path of public directory for a given url", () => {
    const url = "/home";
    const actualOutput = getFilePath(url);
    const expectedOutput = "./public/home";
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("should return file path of index.html of public directory if given url is root", () => {
    const url = "/";
    const actualOutput = getFilePath(url);
    const expectedOutput = "./public/index.html";
    assert.strictEqual(actualOutput, expectedOutput);
  });
});
