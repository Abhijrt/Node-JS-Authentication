// importing the express
const express = require("express");

// taking the router form the express server
const router = express.Router();

// fetching the home controller
const usersController = require("../controllers/users_controller");
const passport = require("passport");
const { checkAuthentication } = require("../config/passport-local-strategy");

// calling the signIN controller when a sign page request come or sign up
router.get("/sign-in", usersController.SignIn);
router.get("/sign-up", usersController.SignUp);
router.post("/create-user", usersController.CreateUser);

// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.CreateSession
);
router.get("/sign-out", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.CreateSession
);

router.get("/changePassword", usersController.changePassword);

router.post("/resetPassword", usersController.reset);

router.get("/forgotPassword", usersController.forgotPassword);

router.post("/forgot", usersController.forgot);
// exporting the router to be used in different module or files
module.exports = router;
