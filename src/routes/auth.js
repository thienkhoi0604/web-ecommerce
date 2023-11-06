const { Router } = require("express");
const { AuthController } = require("../controllers");

const AuthRouter = Router();

AuthRouter.get("/", AuthController.index);

module.exports = AuthRouter;