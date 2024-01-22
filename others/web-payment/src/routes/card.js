const { Router } = require("express");
const { CardController } = require("../controllers");

const CardRouter = Router();

CardRouter.get("/:cardNumber", CardController.get);
CardRouter.post("/", CardController.create);
CardRouter.put("/", CardController.update);
CardRouter.delete("/", CardController.delete);

module.exports = CardRouter;