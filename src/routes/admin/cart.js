const { Router } = require("express");
const { CartController } = require("../../controllers/admin");

var CartRouter = Router();

CartRouter.get("/", CartController.index);

module.exports = CartRouter;