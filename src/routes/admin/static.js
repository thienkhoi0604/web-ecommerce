const { Router } = require("express");
const { StaticController } = require("../../controllers/admin");

var StaticRouter = Router();

StaticRouter.get("/", StaticController.index);

module.exports = StaticRouter;