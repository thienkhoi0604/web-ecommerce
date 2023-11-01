require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//import user define
const { errorHandler } = require("./middlewares/errors/error-handler");
const { errorLogger } = require("./middlewares/errors/error-logger");
const { errorNotFound } = require("./middlewares/errors/error-not-found");

const app = express();

const PORT = process.env.PORT || 8080;

//Config
app.use(cors());

//Middlewares
// parse requests of content-type - application/json
app.use(bodyParser.json());

//Route
// app.use("/api", require("./routes"));
app.use("/test", (req, res) => res.send("from test!"));
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// global error handler
app.use(errorNotFound, errorLogger, errorHandler);

app.listen(PORT, (req, res) => console.log(`App listening on port ${PORT}`));
