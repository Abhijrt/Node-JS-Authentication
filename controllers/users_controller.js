const User = require("../models/users");
const bcrypt = require("bcrypt");

// When a sign page request come then this function run
module.exports.SignIn = function (req, res) {
  console.log("In Controller");
  return res.render("sign-in", {
    title: "Sign In",
  });
};

// When a sign up page request come this function run
module.exports.SignUp = function (req, res) {
  return res.render("sign-up", {
    title: "Sign Up",
  });
};

// when a user registration done then this function run
module.exports.CreateUser = async function (req, res) {
  try {
    console.log(req.body);
    let requestEmail = req.body.email;
    if (req.body.password !== req.body.confirm_password) {
      // req.flash("error", "password does not matched");
      return res.redirect("back");
    }
    let user = await User.findOne({ email: requestEmail });
    let password = req.body.password;
    console.log("password", password);
    let newPassword = await bcrypt.hash(password, 10);
    console.log("NewPassword", newPassword);
    if (!user) {
      user = await User.create({
        email: requestEmail,
        password: newPassword,
        name: req.body.name,
        phone: req.body.phone,
      });
      req.flash("success", "Register SuccessFully");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error on Creating the User", err);
    return;
  }
};

module.exports.CreateSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logged Out SuccessFully");
  return res.redirect("/");
};

module.exports.changePassword = function (req, res) {
  res.render("changePassword", {
    title: "Reset Password",
  });
};

module.exports.reset = async function (req, res) {
  let user = await User.findOne({ email: req.user.email });
  console.log("User", user);
  console.log("body", req.body);
  let match = await bcrypt.compare(req.body.oldpassword, user.password);
  if (match) {
    console.log("hii");
    let passwordReq = req.body.password;
    let newPassword = await bcrypt.hash(passwordReq, 10);
    await User.findOneAndUpdate(
      { email: req.user.email },
      { password: newPassword }
    );
    req.flash("success", "Rest Password SuccessFully");
    return res.redirect("/");
  }
  return res.redirect("back");
};
