const { Router } = require("express");
const HomeRouter = require("./home");
const { author } = require("../../middlewares");
const { USER_ROLE } = require("../../constants");
const ProductRouter = require("./product");
const CategoryRouter = require("./category");
const OrderRouter = require("./order");
const StaticRouter = require("./static");
const ErrorRouter = require("./error");
const UserRouter = require("./user");

const AdminRouter = Router();

AdminRouter.use("/", HomeRouter);
AdminRouter.use("/products", ProductRouter);
AdminRouter.use("/categories", CategoryRouter);
AdminRouter.use("/orders", OrderRouter);
AdminRouter.use("/statics", StaticRouter);
AdminRouter.use("/users", UserRouter);
AdminRouter.use("/", ErrorRouter);
// AdminRouter.use("/", author(USER_ROLE.ADMIN), HomeRouter);

module.exports = AdminRouter;