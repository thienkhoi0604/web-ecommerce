require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { engine } = require("express-handlebars");

//import user define
const { errorHandler } = require("./middlewares/errors/error-handler");
const { errorLogger } = require("./middlewares/errors/error-logger");
const { errorNotFound } = require("./middlewares/errors/error-not-found");

const app = express();

const PORT = process.env.PORT || 8080;

//Config
app.use(cors());

//Static Folder
app.use("/public", express.static(path.join(__dirname, "public")));

//Sets our app to use the handlebars engine
app.engine(
  "hbs",
  engine({
    layoutsDir: __dirname + "/views/layouts",
    //new configuration parameter
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

//Middlewares
// parse requests of content-type - application/json
app.use(bodyParser.json());

//Route
// app.use("/api", require("./routes"));
app.get("/", (req, res) => {
  res.render("home");
});

//Route for test
app.use("/test", (req, res) => res.send("Hello world"));
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// global error handler
app.use(errorNotFound, errorLogger, errorHandler);

app.listen(PORT, (req, res) => console.log(`App listening on port ${PORT}`));

module.exports = { app };
