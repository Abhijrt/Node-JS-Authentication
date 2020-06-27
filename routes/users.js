// importing the express
const express = require("express");

// taking the router form the express server
const router = express.Router();

// fetching the home controller
const usersController = require("../controllers/users_controller");

// calling the signIN controller when a sign page request come or sign up
router.get("/sign-in", usersController.SignIn);
router.get("/sign-up", usersController.SignUp);
router.post("/create-user", usersController.CreateUser);
router.post("/create-session", usersController.CreateSession);

// exporting the router to be used in different module or files
module.exports = router;
