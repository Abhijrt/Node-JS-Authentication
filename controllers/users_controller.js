const User = require("../models/users");

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
    title: "Sign In",
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
    if (!user) {
      user = await User.create({
        email: requestEmail,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
      });
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error on Creating the User", err);
    return;
  }
};

module.exports.CreateSession = function (req, res) {};
