const { Router } = require("express");
const HomeRouter = require("./home");
const { author } = require("../../middlewares");
const { USER_ROLE } = require("../../constants");

const AdminRouter = Router();

AdminRouter.use("/", author(USER_ROLE.ADMIN), HomeRouter);
AdminRouter.use("/admin", HomeRouter);

module.exports = AdminRouter;