const User = require("../models/users");
const bcrypt = require("bcrypt");
const forgotMailer = require("../mailers/emailMailer");
const crypto = require("crypto");
const nodeMailer = require("../config/nodemailer");
const { localsName } = require("ejs");
const { url } = require("inspector");

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
      req.flash("error", "password does not matched");
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
  // console.log("url", req.url);
  let token = req.url.slice(16);
  // console.log(token);
  res.render("changePassword", {
    title: "Reset Password",
    token: token,
  });
};

module.exports.reset = async function (req, res) {
  if (req.isAuthenticated()) {
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
      req.flash("success", "Reset Password SuccessFully");
      return res.redirect("/");
    }
    return res.redirect("back");
  }
  // console.log("Not Login", req.body);
  // console.log(req.params);
  let token = req.params.token;
  // console.log(token);
  let user = User.findOne({ resetLink: token });
  if (user) {
    let passwordReq = req.body.password;
    let newPassword = await bcrypt.hash(passwordReq, 10);
    await User.findOneAndUpdate(
      { resetLink: token },
      { password: newPassword }
    );
    req.flash("success", "Reset Password SuccessFully");
    return res.redirect("back");
  }
  return res.redirect("back");
};

module.exports.forgotPassword = function (req, res) {
  return res.render("forgotPassword", {
    title: "Forgot Password",
  });
};

module.exports.forgot = async function (req, res) {
  console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("success", "We send you the Mail for reset Password");
    let token = crypto.randomBytes(32).toString("hex");
    const data = {
      from: "abhi.jrt12@gmail.com",
      to: req.body.email,
      subject: "Forgot password link send",
      html: `<h2>Please Click on Given Link to Reset Your Password !</h2>
      <p><a>http://localhost:8000/users/changePassword/${token}</a></p>`,
    };
    return User.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        console.log("Reset Password Link Error");
        return res.redirect("back");
      } else {
        nodeMailer.tranporter.sendMail(data, (err, info) => {
          if (err) {
            console.log("error in searching mail", info, err);
            return;
          }
          console.log("Message Sent!");
          return res.redirect("back");
        });
      }
    });
  }
  req.flash("error", "User not Available");
  return res.redirect("back");
};
