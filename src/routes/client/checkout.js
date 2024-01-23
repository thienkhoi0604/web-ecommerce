const { Router } = require("express");
const { CheckoutController } = require("../../controllers/client");

const CheckoutRouter = Router();

CheckoutRouter.get("/", CheckoutController.index);

module.exports = CheckoutRouter;