// importing the express server
const express = require("express");

// Giving the port number on which the server run
const port = 8000;

// take the server as a app
const app = express();

const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

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

//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-stratregy");

//mongo store for storing session
const MongoStore = require("connect-mongo")(session);

//mongo store is used to store session cookie in DB
app.use(
  session({
    name: "Nodejs-auth",
    //todo change the secret before deployment in production
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100, //number of minutes in miliseconds
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        if (err) {
          console.log("Error in storing session");
        }
        console.log("Mongo Store Connected");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// tell the rserver to use flash
app.use(flash());

app.use(customMiddleware.setFlash);
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
