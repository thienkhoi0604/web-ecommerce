const { Router } = require("express");
const { CheckoutController } = require("../../controllers/client");

const CheckoutRouter = Router();

CheckoutRouter.post("/info", CheckoutController.info);
CheckoutRouter.post("/card", CheckoutController.card);
CheckoutRouter.post("/review", CheckoutController.review);
CheckoutRouter.post("/cancel", CheckoutController.cancel);
CheckoutRouter.post("/back", CheckoutController.back);
CheckoutRouter.get("/current-order", CheckoutController.currentOrder);
CheckoutRouter.get("/", CheckoutController.index);

module.exports = CheckoutRouter;    