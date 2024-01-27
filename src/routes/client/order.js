const { Router } = require('express');
const { OrderController } = require('../../controllers/client');

const OrderRouter = Router();

OrderRouter.get('/', OrderController.index);
OrderRouter.get('/getAll', OrderController.getAll);

module.exports = OrderRouter;
