const { Router } = require("express");
const { CategoryController } = require("../../controllers/admin");

var CategoryRouter = Router();

CategoryRouter.get("/search", CategoryController.search);
CategoryRouter.get("/search/:id", CategoryController.get);
CategoryRouter.get("/", CategoryController.index);
CategoryRouter.post("/", CategoryController.add);
CategoryRouter.put("/", CategoryController.update);
CategoryRouter.delete("/", CategoryController.delete);
module.exports = CategoryRouter;