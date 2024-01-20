const { Router } = require("express");
const HomeRouter = require("./home");
const { author } = require("../../middlewares");
const { USER_ROLE } = require("../../constants");
const ProductRouter = require("./product");
const CategoryRouter = require("./category");
const CartRouter = require("./cart");
const StaticRouter = require("./static");
const ErrorRouter = require("./error");

const AdminRouter = Router();

AdminRouter.use("/", HomeRouter);
AdminRouter.use("/products", ProductRouter);
AdminRouter.use("/categories", CategoryRouter);
AdminRouter.use("/carts", CartRouter);
AdminRouter.use("/statics", StaticRouter);
AdminRouter.use("/", ErrorRouter);
// AdminRouter.use("/", author(USER_ROLE.ADMIN), HomeRouter);

module.exports = AdminRouter;