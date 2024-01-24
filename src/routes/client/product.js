const { Router } = require("express");
const { ProductController } = require("../../controllers/client");

const ProductRouter = Router();

ProductRouter.get("/search", ProductController.search);
ProductRouter.get("/:_id", ProductController.get);
ProductRouter.get("/", ProductController.index);

module.exports = ProductRouter;