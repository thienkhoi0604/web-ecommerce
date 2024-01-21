const { Router } = require("express");
const { ProductController } = require("../../controllers/client");

const ProductRouter = Router();

ProductRouter.get("/products", ProductController.getAllProducts);
ProductRouter.get("/products/category/:category", ProductController.getProductsByCategory);
ProductRouter.get("/products/search", ProductController.searchProducts);
ProductRouter.get("/products/detail/:_id", ProductController.getProductDetail);
// ProductRouter.get("/cart/:_id", ProductController.addToCart);

module.exports = ProductRouter;