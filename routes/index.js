// importing the express
const express = require("express");

// taking the router form the express server
const router = express.Router();

// fetching the home controller
const homeController = require("../controllers/home_controller");

// calling the home controller when a home page request come
router.get("/", homeController.home);

// exporting the router to be used in different module or files
module.exports = router;
