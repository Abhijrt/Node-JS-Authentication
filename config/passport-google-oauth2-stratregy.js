const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/users");

// tell the passport to use new starategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "544442160751-uqgj3ct6d2q5l1a14ctlbp9m5d0b2jfq.apps.googleusercontent.com",
      clientSecret: "O9HPUMb72Fp9YsemFdsS5Pgl",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google Strategy");
          return;
        }
        console.log(profile);
        if (user) {
          // if found then set this user as req.user
          return done(null, user);
        } else {
          // if not found create  new user and set it as req.user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
              phone: 9876543211,
            },
            function (err, user) {
              if (err) {
                console.log("Error in creating user Strategy");
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
