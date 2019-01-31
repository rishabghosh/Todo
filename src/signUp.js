const fs = require("fs");
const readArgs = require("./parser.js");
const { getFilePathForUser, writeJsonData } = require("./utils.js");
const USERS = require("../dataBase/users.json");
const { redirect } = require("./requestHandlers");
const { ROOT, EMPTY_OBJECT, USERS_JSON_PATH } = require("./constants.js");

const WRITER = fs.writeFile;

const storeSignUpCredentials = function(req, res) {
  const credentials = readArgs(req.body);
  const path = getFilePathForUser(credentials.username);
  USERS[credentials.username] = credentials;
  writeJsonData(USERS_JSON_PATH, USERS, WRITER);
  writeJsonData(path, EMPTY_OBJECT, WRITER);
  redirect(res, ROOT);
};

module.exports = storeSignUpCredentials;
