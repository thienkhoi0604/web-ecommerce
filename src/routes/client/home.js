const { Router } = require("express");
const { HomeController } = require("../../controllers/client");

var HomeRouter = Router();

HomeRouter.get("/", HomeController.index);
HomeRouter.get("/about-us", HomeController.aboutUs);
HomeRouter.get("/contact", HomeController.contact);

module.exports = HomeRouter;