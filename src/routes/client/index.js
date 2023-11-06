const { Router } = require("express");
const HomeRouter = require("./home");

const ClientRouter = Router();

ClientRouter.use("/", HomeRouter);

module.exports = ClientRouter;