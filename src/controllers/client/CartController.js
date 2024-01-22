const Cart = require("../../models/CartModel");
const Product = require("../../models/ProductModel");

const CartController = {
    async viewCart(req, res, next) {
        try {
            const defaultUserId = 'defaultUserId';
            const cart = await Cart.findOne({ createdBy: defaultUserId }).populate({
                path: 'products',
                populate: {
                    path: 'createByObj updateByObj deleteByObj categoryObj',
                    select: 'name email',
                }
            });

            if (!cart) {
                return res.render('client/cart', { layout: false, cart: null });
            }

            res.render('client/cart', { layout: false, cart });

        } catch (error) {
            next(error);
        }
    },
}

module.exports = CartController;