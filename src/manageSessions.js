const readArgs = require("./parser.js");
const { redirect } = require("./requestHandlers.js");
const { ROOT } = require("./constants.js");
const USERS = require("../dataBase/users.json");
const { setCookie } = require("./requestHandlers.js");

const logOut = function(req, res) {
  res.setHeader("Set-Cookie", "username=; expires=\"\"");
  redirect(res, ROOT);
};

const hasCorrectCredentials = function(credentials) {
  const givenUsername = credentials.username;
  const givenPassword = credentials.password;
  const UsersCredentials = USERS[givenUsername];
  return (
    USERS.hasOwnProperty(givenUsername) &&
    UsersCredentials.password === givenPassword
  );
};

const checkLoginCredentials = function(req, res) {
  const credentials = readArgs(req.body);
  if (hasCorrectCredentials(credentials)) {
    let username = credentials.username;
    setCookie(res, username);
    redirect(res, "/homepage");
    return;
  }
  redirect(res, ROOT);
};

module.exports = {
  logOut,
  checkLoginCredentials
};
