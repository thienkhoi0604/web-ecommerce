const { Router } = require('express');
const { CardController } = require('../../controllers/client');

const CardRouter = Router();

CardRouter.get('/search', CardController.search);
CardRouter.post('/', CardController.add);
CardRouter.get('/:_id', CardController.get);
CardRouter.delete('/', CardController.delete);

module.exports = CardRouter;
