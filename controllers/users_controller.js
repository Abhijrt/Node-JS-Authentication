const User = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodeMailer = require("../config/nodemailer");

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
    let requestEmail = req.body.email;
    // matching the password
    if (req.body.password !== req.body.confirm_password) {
      req.flash("error", "password does not matched");
      return res.redirect("back");
    }
    // finding the user if already exist
    let user = await User.findOne({ email: requestEmail });
    let password = req.body.password;
    let newPassword = await bcrypt.hash(password, 10);
    // if not exist then create
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

// when user wants to login
module.exports.CreateSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};

// when user wants to logout
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logged Out SuccessFully");
  return res.redirect("/");
};

// when user want to change the password and forgot password
module.exports.changePassword = function (req, res) {
  // console.log("url", req.url);
  let token = req.url.slice(16);
  // console.log(token);
  res.render("changePassword", {
    title: "Reset Password",
    token: token,
  });
};

// when user set new passwprd
module.exports.reset = async function (req, res) {
  // when user login
  if (req.isAuthenticated()) {
    let user = await User.findOne({ email: req.user.email });
    let match = await bcrypt.compare(req.body.oldpassword, user.password);
    if (match) {
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
  // when user is not login
  let token = req.params.token;
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

// when user click on forgot password
module.exports.forgotPassword = function (req, res) {
  return res.render("forgotPassword", {
    title: "Forgot Password",
  });
};

// when we send the mail for the user to reset password
module.exports.forgot = async function (req, res) {
  console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let token = crypto.randomBytes(32).toString("hex");
    const data = {
      from: "abhi.jrt12@gmail.com",
      to: req.body.email,
      subject: "Forgot password link send",
      html: `<h2>Please Click on Given Link to Reset Your Password !</h2>
      <a>http://localhost:8000/users/changePassword/${token}</a>`,
    };
    return User.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        console.log("Reset Password Link Error");
        return res.redirect("back");
      } else {
        nodeMailer.tranporter.sendMail(data, (err, info) => {
          if (err) {
            console.log("error in searching mail", info, err);
            req.flash("error", "Not available emial id");
            return res.redirect("back");
          }
          req.flash("success", "We send you the Mail for reset Password");
          console.log("Message Sent!");
          return res.redirect("back");
        });
      }
    });
  }
  req.flash("error", "User not Available");
  return res.redirect("back");
};
