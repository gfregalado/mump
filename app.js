require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");


// This is also required for the LOGIN/SIGNUP stuff !!!! --------

const session = require("express-session");
const mongoStore = require("connect-mongo")(session);

// -------------------------------------------

mongoose
  .connect("mongodb://heroku_2nqntzl4:cv4fbi2onlcnprgfc9q551bnm@ds149606.mlab.com:49606/heroku_2nqntzl4", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setting the session time -> important when setting up the Login/Signup process !!!!!    ---------

app.use(
  session({
    secret: "mump-project-secret",
    cookie: { maxAge: 1800000 },
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 //1 day
    })
  })
);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Mump - Less Mumbling More Doing";

app.use("/", require("./routes/index"));
app.use("/", require("./routes/staff-routes"));
app.use("/", require("./routes/auth-routes"));
app.use("/", require("./routes/user-routes"));

module.exports = app;
