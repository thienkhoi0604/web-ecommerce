const { Router } = require("express");
const HomeRouter = require("./home");

const AdminRouter = Router();

AdminRouter.use("/", HomeRouter);

module.exports = AdminRouter;