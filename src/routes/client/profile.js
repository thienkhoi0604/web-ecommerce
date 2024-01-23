const { Router } = require("express");
const { ProfileController } = require("../../controllers/client");

const ProfileRouter = Router();

ProfileRouter.get("/", ProfileController.index);

module.exports = ProfileRouter;