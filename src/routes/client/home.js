const { Router } = require("express");
const { HomeController } = require("../../controllers/client");

var HomeRouter = Router();

HomeRouter.get("/", HomeController.index);

module.exports = HomeRouter;