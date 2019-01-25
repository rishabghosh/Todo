/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { createCache } = require("../src/cache");
const { FileSystem } = require("./simulators.js");

describe("createCache", function() {
  it("Should return object of file contents", function() {
    const fs = new FileSystem();
    fs.filenames.push("index.html", "homepage.html", "js", "style");
    fs.fileContents["./public/index.html"] = "0\n1\n2\n3\n4",
    fs.fileContents["./public/homepage.html"] = "abcd";

    const actualOutput = createCache(fs);
    const expectedOutput = {
      "./public/index.html": "0\n1\n2\n3\n4",
      "./public/homepage.html": "abcd"
    };

    assert.deepStrictEqual(actualOutput, expectedOutput);
  });
});
