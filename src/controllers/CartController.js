const CartModel = require('../models/CartModel');

const CartController = {
    viewCart: (req, res) => {
        CartModel.addToItem({ productName: 'Product 1', price: 10 });
        const cartItems = CartModel.getCartItems();
        res.render('cart', { cartItems });
    },

    addToCard: function (req, res) {
        const { item, id } = req.body;
        let oldCart = req.session.cart || {};
        let cart = new CartModel(oldCart);
        cart.add(item, id);
        req.session.cart = cart;
        res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng thành công' });
    },

    getCartItems: function (req, res) {
        let oldCart = {};
        let cart = new CartModel(oldCart);
        const items = cart.generateArray();
        res.status(200).json({ cartItems: items });
    }
};

module.exports = CartController;