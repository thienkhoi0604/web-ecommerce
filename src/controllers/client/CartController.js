const { CartModel, ProductModel } = require("../../models");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");

const CartController = {
    async index(req, res, next) {
        res.render('client/cart');
    },
    async add(req, res, next) {
        try {
            const _user = req.locals._user;
            const { productId } = req.body;

            let params = {};
            params.products = []
            const product = await ProductModel.findById({ _id: productId });
            params.products.push(product?._id);
            params.createdBy = _user?._id;

            const cart = await CartModel.create(params);
            res.json({
                data: cart.toObject(),
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add product to cart successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async get(req, res, next) {

    },
    async update(req, res, next) {

    },
    async delete(req, res, next) {

    },
}

module.exports = CartController;