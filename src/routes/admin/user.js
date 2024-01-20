const { Router } = require("express");
const { UserController } = require("../../controllers/admin");

var UserRouter = Router();

UserRouter.get("/", UserController.index);

module.exports = UserRouter;