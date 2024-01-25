const { Router } = require("express");
const { CheckoutController } = require("../../controllers/client");

const CheckoutRouter = Router();

CheckoutRouter.get("/", CheckoutController.index);
CheckoutRouter.post("/info", CheckoutController.info);
CheckoutRouter.post("/card", CheckoutController.card);

module.exports = CheckoutRouter;