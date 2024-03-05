const express = require("express");
const path = require("path");
const twig = require("twig");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
twig.cache(false);
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var MemoryStore = require("memorystore")(session);
var sessionStore = new MemoryStore({
  checkPeriod: 3600 * 24, // prune expired entries every 24h
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    name: "LMSUSERID",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 10 },
    store: sessionStore,
  })
);

app.use("/", require("./routes"));

const server = app.listen(3000, () => {
  console.log(`The application started on port ${server.address().port}`);
});
