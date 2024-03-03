const express = require("express");
const path = require("path");
const twig = require("twig");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(express.static(path.join(__dirname, "public")));
twig.cache(false);
app.get("/", require("./routes"));

const server = app.listen(3000, () => {
  console.log(`The application started on port ${server.address().port}`);
});
