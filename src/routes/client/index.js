const { Router } = require("express");
const HomeRouter = require("./home");
const CartRouter = require("./cart")
const ProductRouter = require("./product");
const ProfileRouter = require("./profile");
const CheckoutRouter = require("./checkout");

const ClientRouter = Router();

ClientRouter.use("/", HomeRouter);
ClientRouter.use("/cart", CartRouter);
ClientRouter.use("/profile", ProfileRouter);
ClientRouter.use("/checkout", CheckoutRouter);
ClientRouter.use("/products", ProductRouter);

module.exports = ClientRouter;