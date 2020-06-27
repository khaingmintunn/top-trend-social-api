const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const routes = require("./routes");
const app = express();
const config = require("./config/config");
const port = 3000;

app.use(cors()); // to enable with cross platform
app.use(logger("dev")); // to enable console log
app.use(body_parser.json()); // request body to json format
app.use(body_parser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.set("etag", false);
app.use(`/${config.version}`, routes);

app.listen(port, () => {
  console.log("server is up ...");
});
