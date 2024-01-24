const { Router } = require('express');
const { CartController } = require('../../controllers/client');

const CartRouter = Router();

CartRouter.get('/', CartController.index);
CartRouter.get('/all', CartController.getAllByUser);
CartRouter.post('/', CartController.add);
CartRouter.put('/quantity/add', CartController.updateQuantityAdd);
CartRouter.delete('/', CartController.delete);

module.exports = CartRouter;
