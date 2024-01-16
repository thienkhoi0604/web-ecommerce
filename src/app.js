require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { engine } = require("express-handlebars");

//import user define
const { errorHandler } = require("./middlewares/errors/error-handler");
const { errorLogger } = require("./middlewares/errors/error-logger");
const { errorNotFound } = require("./middlewares/errors/error-not-found");
const { db, passport} = require("./configs");
const routes = require("./routes");
const { LAYOUT } = require("./constants");

const app = express();

const PORT = process.env.PORT || 8080;

//connect to db
db.connect();

//Config
app.use(cors());

//Static Folder
app.use("/public", express.static(path.join(__dirname, "public")));

//Sets our app to use the handlebars engine
app.engine(
  "hbs",
  engine({
    defaultLayout: "client",
    layoutsDir: __dirname + "/views/layouts",
    //new configuration parameter
    extname: "hbs",
    partialsDir: __dirname + "/views/layouts/partials",
  })
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use((req, res, next) => {
  const { originalUrl } = req;
  const layout = originalUrl.match(/^\/admin/) ? LAYOUT.ADMIN : LAYOUT.CLIENT;
  res.locals.layout = layout;
  next();
})


//Middlewares
// parse requests of content-type - application/json
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

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

app.listen(PORT, (req, res) => console.log(`App listening on port ${PORT}`));

module.exports = { app };
