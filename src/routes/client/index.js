const { Router } = require("express");
const HomeRouter = require("./home");
const CartRouter = require("./cart")
const ProductRouter = require("./products")
const DetailRouter = require("./detail")

const ClientRouter = Router();

ClientRouter.use("/", HomeRouter);
ClientRouter.use("/", CartRouter);
ClientRouter.use("/", ProductRouter);
ClientRouter.use("/", DetailRouter);

module.exports = ClientRouter;