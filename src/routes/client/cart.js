const { Router } = require('express');
const { CartController } = require('../../controllers/client');

const CartRouter = Router();

CartRouter.get('/', CartController.index);
CartRouter.get('/id', CartController.get);
CartRouter.put('/', CartController.update);
CartRouter.delete('/', CartController.delete);

module.exports = CartRouter;
