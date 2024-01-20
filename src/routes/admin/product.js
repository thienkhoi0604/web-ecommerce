const { Router } = require("express");
const { ProductController } = require("../../controllers/admin");

var ProductRouter = Router();

ProductRouter.get("/search", ProductController.search);
ProductRouter.get("/search/:id", ProductController.get);
ProductRouter.get("/", ProductController.index);
ProductRouter.post("/", ProductController.add);
ProductRouter.put("/", ProductController.update);
ProductRouter.delete("/", ProductController.delete);

module.exports = ProductRouter;