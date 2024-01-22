require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require('http');
const https = require("https");
const fs = require("fs");

//import user define
const { errorHandler } = require("./middlewares/errors/error-handler");
const { errorLogger } = require("./middlewares/errors/error-logger");
const { errorNotFound } = require("./middlewares/errors/error-not-found");
const { db } = require("./configs");
const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8081;

//connect to db
db.connect();

//Config
app.use(cors());

//Middlewares
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//Route
// app.use("/api", require("./routes"));

routes(app);

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// global error handler
app.use(errorNotFound, errorLogger, errorHandler);

// app.listen(PORT, (req, res) => console.log(`App listening on port ${PORT}`));

http.createServer(app).listen(PORT, () => {
  console.log(`HTTPS server started on port ${PORT}`);
});

const options = {
  key: fs.readFileSync("./config/key.pem"),
  cert: fs.readFileSync("./config/cert.pem"),
};
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server started on port ${HTTPS_PORT}`);
});

module.exports = { app };
