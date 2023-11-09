const { Router } = require("express");
const { AuthController } = require("../controllers");

const AuthRouter = Router();

AuthRouter.get("/login", AuthController.login);
AuthRouter.get("/register", AuthController.registor);

module.exports = AuthRouter;