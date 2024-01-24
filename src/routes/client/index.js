const { Router } = require("express");
const HomeRouter = require("./home");
const CartRouter = require("./cart")
const ProductRouter = require("./product");
const ProfileRouter = require("./profile");
const CheckoutRouter = require("./checkout");
const ErrorRouter = require("./error");
const { author } = require("../../middlewares");
const { USER_ROLE } = require("../../constants");
const CardRouter = require("./card");

const ClientRouter = Router();

ClientRouter.use("/", HomeRouter);
ClientRouter.use("/cart", author(USER_ROLE.USER), CartRouter);
ClientRouter.use("/card", author(USER_ROLE.USER), CardRouter);
ClientRouter.use("/profile", author(USER_ROLE.USER), ProfileRouter);
ClientRouter.use("/checkout", author(USER_ROLE.USER), CheckoutRouter);
ClientRouter.use("/products", ProductRouter);
ClientRouter.use("/", ErrorRouter);

module.exports = ClientRouter;