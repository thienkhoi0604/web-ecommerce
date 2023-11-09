const { Router } = require("express");
const { AuthController } = require("../controllers");

const AuthRouter = Router();

AuthRouter.get("/login", AuthController.login);
AuthRouter.post("/login", AuthController.doLogin);
AuthRouter.get("/register", AuthController.register);
AuthRouter.post("/register", AuthController.doRegister);

module.exports = AuthRouter;