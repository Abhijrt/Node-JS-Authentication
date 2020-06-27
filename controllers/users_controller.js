module.exports.SignIn = function (req, res) {
  console.log("In Controller");
  return res.render("sign-in", {
    title: "Sign In",
  });
};

module.exports.SignUp = function (req, res) {
  return res.render("sign-up", {
    title: "Sign In",
  });
};
