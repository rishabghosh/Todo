const readArgs = require("./parser.js");
const { setCookie } = require("./requestHandlers.js");
const { ROOT } = require("./constants.js");
const USERS = require("../dataBase/users.json");

const logOut = function(req, res) {
  res.setHeader("Set-Cookie", 'username=; expires=""');
  res.redirect(ROOT);
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
    res.redirect("/homepage");
    return;
  }
  res.redirect(ROOT);
};

module.exports = {
  logOut,
  checkLoginCredentials
};
