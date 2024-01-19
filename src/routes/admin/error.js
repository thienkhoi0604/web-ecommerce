const { Router } = require("express");
const { ErrorController } = require("../../controllers/admin");

var ErrorRouter = Router();

ErrorRouter.get("*", ErrorController._404);

module.exports = ErrorRouter;