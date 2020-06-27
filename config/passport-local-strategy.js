const passport = require("passport");
const User = require("../models/users");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// authentication using the passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      // find the user and stablish the identity
      let user = await User.findOne({ email: email.toLowerCase() });
      const match = await bcrypt.compare(password, user.password);
      if (!user || !match) {
        console.log("Invalid user name or password");
        return done(null, false);
      }
      // If user found
      return done(null, user);
    }
  )
);

passport.checkAuthentication = function (request, response, next) {
  if (request.isAuthenticated()) {
    //if user is authenticated pass on the request to next function(controllers action)
    return next();
  }
  //if user is not signed in
  return response.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (request, response, next) {
  if (request.isAuthenticated()) {
    //request.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
    response.locals.user = request.user;
  }
  next();
};

//serializing the user to decide which key to keep in cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the use from the key in cookie
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding User");
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = passport;
