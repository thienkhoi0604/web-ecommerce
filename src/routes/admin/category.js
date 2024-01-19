const { Router } = require("express");
const { CategoryController } = require("../../controllers/admin");

var CategoryRouter = Router();

CategoryRouter.get("/", CategoryController.index);

module.exports = CategoryRouter;