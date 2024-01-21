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
    async addToCart(req, res, next) {
        try {
            const productId = req.params._id;
            const defaultUserId = 'defaultUserId';

            const cart = await Cart.findOne({ createdBy: defaultUserId }).lean();
            const product = await Product.findById(productId).lean();

            if (!cart) {
                const newCart = new Cart({
                    userId: defaultUserId,
                    products: [{ product: _id, quantity: 1 }],
                    createdBy: defaultUserId,
                })

                await newCart.save();
            } else {
                const existingProduct = cart.products.find(p => p.product.toString() === productId)

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.products.push({ product: productId, quantity: 1 });
                }
                await cart.save();
            }

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CartController;