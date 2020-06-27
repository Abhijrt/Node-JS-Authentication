// importing the express server
const express = require("express");

// Giving the port number on which the server run
const port = 8000;

// take the server as a app
const app = express();

// importing the sass middleware and configure so that we can use it to design our page in simple way
const sassMiddleware = require("node-sass-middleware");
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

// for taking req arguments content
app.use(express.urlencoded());

// tell the server to use the layouts and partials
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

//extracting styles and sheets at top in head tag
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// tell the server to use database
const db = require("./config/mongoose");

// tell the server to use the assets
app.use(express.static("./assets"));

// seting the view engine and views
app.set("view engine", "ejs");
app.set("views", "./views");

// tell the app to use the router
app.use("/", require("./routes"));

// tell the server to run on the port number 800
app.listen(port, function (err) {
  if (err) {
    console.log("Error on connecting to the Server");
    return;
  }
  console.log(`Connected Successfully to the server on port number ${port}`);
});
