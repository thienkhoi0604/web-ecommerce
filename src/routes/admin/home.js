const { Router } = require("express");
const { HomeController } = require("../../controllers/admin");

var HomeRouter = Router();

HomeRouter.get("/", HomeController.index);

module.exports = HomeRouter;