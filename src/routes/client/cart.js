const { Router } = require('express');
const { CartController } = require('../../controllers/client');

const CartRouter = Router();

CartRouter.get('/cart', CartController.viewCart);
CartRouter.get('/cart/addToCart/:_id', CartController.addToCart);


module.exports = CartRouter;
