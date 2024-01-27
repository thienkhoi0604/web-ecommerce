const { Router } = require("express");
const { ProfileController } = require("../../controllers/client");

const ProfileRouter = Router();

ProfileRouter.get("/", ProfileController.index);
ProfileRouter.put("/", ProfileController.update);
ProfileRouter.put("/update-password", ProfileController.updatePassword);

module.exports = ProfileRouter;