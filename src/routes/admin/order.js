const { Router } = require("express");
const { OrderController } = require("../../controllers/admin");

var OrderRouter = Router();

OrderRouter.get("/search", OrderController.search);
OrderRouter.get("/search/:id", OrderController.get);
OrderRouter.get("/", OrderController.index);
OrderRouter.put("/", OrderController.update);
OrderRouter.delete("/", OrderController.delete);
module.exports = OrderRouter;