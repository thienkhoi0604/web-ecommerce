const { Router } = require("express");
const { UserController } = require("../../controllers/admin");

var UserRouter = Router();

UserRouter.get("/search", UserController.search);
UserRouter.get("/search/:id", UserController.get);
UserRouter.get("/", UserController.index);
UserRouter.post("/", UserController.add);
UserRouter.put("/", UserController.update);
UserRouter.delete("/", UserController.delete);

module.exports = UserRouter;