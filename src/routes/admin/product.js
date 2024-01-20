const { Router } = require("express");
const { ProductController } = require("../../controllers/admin");

var ProductRouter = Router();

ProductRouter.get("/", ProductController.index);

module.exports = ProductRouter;