const { Router } = require("express");
const { ProductController } = require("../../controllers/client");

const ProductRouter = Router();

ProductRouter.get("/", ProductController.index);
ProductRouter.get("/:_id", ProductController.get);
ProductRouter.get("/search", ProductController.search);

module.exports = ProductRouter;