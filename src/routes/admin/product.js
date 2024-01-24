const { Router } = require("express");
const { ProductController } = require("../../controllers/admin");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

var ProductRouter = Router();

ProductRouter.get("/search", ProductController.search);
ProductRouter.get("/search/:id", ProductController.get);
ProductRouter.get("/", ProductController.index);
ProductRouter.post("/", ProductController.add);
ProductRouter.post("/image", upload.single("image"), ProductController.image);
ProductRouter.put("/", ProductController.update);
ProductRouter.delete("/", ProductController.delete);

module.exports = ProductRouter;