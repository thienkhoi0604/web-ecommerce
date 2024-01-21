const { Router } = require('express');
const { CartController } = require('../../controllers/client');

const CartRouter = Router();

//CartRouter.get('/cart', CartController.viewCart);
CartRouter.get('/cart', (req, res) => {
  res.render('cart', { layout: false });
});
CartRouter.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

module.exports = CartRouter;
