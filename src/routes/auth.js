const { Router } = require("express");
const { AuthController } = require("../controllers");

const AuthRouter = Router();

AuthRouter.get("/login", AuthController.login);
AuthRouter.post("/login", AuthController.doLogin);
AuthRouter.get("/register", AuthController.register);
AuthRouter.post("/register", AuthController.doRegister);
AuthRouter.get("/logout", AuthController.doLogout);
AuthRouter.get("/facebook", AuthController.loginWithFb);
AuthRouter.get("/facebook/callback", AuthController.doLoginWithFb);
AuthRouter.get("/google", AuthController.loginWithGg);
AuthRouter.get("/google/callback", AuthController.doLoginWithGg);

module.exports = AuthRouter;