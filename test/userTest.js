/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;
const User = require("../src/user.js");

describe("Class User", () => {
  const name = "abcd";
  const username = "abcd1234";
  const password = "xxxabcd1234xxx";

  it("getName method should return given name", () => {
    const user = new User(name, username, password);
    const actualOutput = user.getName();
    const expectedOutput = "abcd";
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("getUsername method should return given username", () => {
    const user = new User(name, username, password);
    const actualOutput = user.getUsername();
    const expectedOutput = "abcd1234";
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("isPasswordValid method should return false if password doesnot match", () => {
    const user = new User(name, username, password);
    const actualOutput = user.isValidPassword("wrongPassword");
    const expectedOutput = false;
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("isPasswordValid method should return true if password matches", () => {
    const user = new User(name, username, password);
    const actualOutput = user.isValidPassword("xxxabcd1234xxx");
    const expectedOutput = true;
    assert.strictEqual(actualOutput, expectedOutput);
  });

  it("addTodoList method should push given element to todo list", () => {
    const user = new User(name, username, password);
    user.addTodoList({ Title: "code now", Description: "No excuse" });
    const actualOutput = user.todo;
    const expectedOutput = [{ Title: "code now", Description: "No excuse" }];
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });

  it("getTodoList method should return current todo list", () => {
    const user = new User(name, username, password);
    user.addTodoList({ Title: "code now", Description: "No excuse" });
    const actualOutput = user.getTodoList();
    const expectedOutput = [{ Title: "code now", Description: "No excuse" }];
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });
});
