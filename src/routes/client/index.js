const { Router } = require("express");
const HomeRouter = require("./home");
const CartRouter = require("./cart")
const ProductRouter = require("./product");
const ProfileRouter = require("./profile");
const CheckoutRouter = require("./checkout");
const ErrorRouter = require("./error");

const ClientRouter = Router();

ClientRouter.use("/", HomeRouter);
ClientRouter.use("/cart", CartRouter);
ClientRouter.use("/profile", ProfileRouter);
ClientRouter.use("/checkout", CheckoutRouter);
ClientRouter.use("/products", ProductRouter);
ClientRouter.use("/", ErrorRouter);

module.exports = ClientRouter;