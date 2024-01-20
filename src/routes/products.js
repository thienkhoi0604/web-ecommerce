const { Router } = require("express");
const { ProductController } = require("../controllers");

const ProductRouter = Router();


// ProductRouter.get('/products', (req, res) => {
//     res.render('products', { layout: false });
// });

ProductRouter.get("/products", ProductController.getAllProducts);
ProductRouter.get("/products/category/:category", ProductController.getProductsByCategory);
ProductRouter.get("/products/search", ProductController.searchProducts);

module.exports = ProductRouter;