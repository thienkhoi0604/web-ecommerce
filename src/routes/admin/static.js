const { Router } = require("express");
const { StaticController } = require("../../controllers/admin");

var StaticRouter = Router();

StaticRouter.get("/", StaticController.index);
StaticRouter.get("/build", StaticController.statics);

module.exports = StaticRouter;