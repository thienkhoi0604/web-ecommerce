const { Router } = require("express");
const { CardController } = require("../controllers");

const CardRouter = Router();

CardRouter.post("/", CardController.create);

module.exports = CardRouter;