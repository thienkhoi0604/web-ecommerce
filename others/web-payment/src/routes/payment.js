const { Router } = require("express");
const { PaymentController } = require("../controllers");

const PaymentRouter = Router();

PaymentRouter.post("/pay", PaymentController.pay);
PaymentRouter.post("/", PaymentController.topup);

module.exports = PaymentRouter;