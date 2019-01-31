const makeLoginVisible = function() {
  console.log("making logging visible");
  const loginDiv = document.getElementById("login");
  loginDiv.style.display = "block";
  const signUpDiv = document.getElementById("sign_up");
  signUpDiv.style.display = "none";
};

const makeSignUpVisible = function() {
  console.log("making signup visible");
  const loginDiv = document.getElementById("login");
  loginDiv.style.display = "none";
  const signUpDiv = document.getElementById("sign_up");
  signUpDiv.style.display = "block";
};

const toggleVisibility = function() {
  const loginLink = document.getElementById("login_link");
  const signUpLink = document.getElementById("sign_up_link");
  signUpLink.onclick = makeSignUpVisible;
  loginLink.onclick = makeLoginVisible;
};

window.onload = toggleVisibility;
