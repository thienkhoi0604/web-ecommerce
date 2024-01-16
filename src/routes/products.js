const { Router } = require('express');

const ProductRouter = Router();

ProductRouter.get('/products', (req, res) => {
    res.render('products', { layout: false });
});

module.exports = ProductRouter;