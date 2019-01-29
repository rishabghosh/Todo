/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;
const { getFilePath } = require("../src/utils.js");

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
