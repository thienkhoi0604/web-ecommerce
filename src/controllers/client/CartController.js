const { Response } = require("../../commons");
const { CartModel, ProductModel } = require("../../models");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");
const categoryService = require("../../services/categoryService");

const CartController = {
    async index(req, res, next) {
        try {
            const _user = res.locals._user;
            const categories = await categoryService.getNestedAll();
            const carts = await CartModel.find({ createdBy: _user?._id }).lean();

            if (!carts) {
                return res.render('client/cart', Response({ res, data: { products: null, categories } }));
            }

            const productIds = carts.map((element) => element.productId)

            const products = await ProductModel.find({
                '_id': { $in: productIds }
            })

            const result = products.map((product) => {
                const cart = carts.find((cart) => cart.productId.toString() === product._id.toString())
                return {
                    ...product.toObject(),
                    quantity: cart?.number,
                    total: cart?.number * product.discountPrice,
                }
            })

            res.render('client/cart', Response({ res, data: { carts, products: result, categories } }));
        } catch (e) {
            console.log(e);
            res.render('client/cart');
        }
    },
    async add(req, res, next) {
        try {
            const _user = res.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId });
            if (cartExist._id) {
                cartExist.number += 1;
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist._id, cartExist, { new: false }).lean();
                return res.json({
                    data: updatedCart,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Add product to cart successfully!"
                });
            }

            let params = {};
            const product = await ProductModel.findById({ _id: productId });
            params.productId = product?._id;
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
    async getAllByUser(req, res, next) {

    },
    async updateQuantityAdd(req, res, next) {
        try {
            const _user = res.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId });
            if (cartExist._id) {
                cartExist.number += 1;
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist._id, cartExist, { new: false }).lean();
                return res.json({
                    data: updatedCart,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Add product to cart successfully!"
                });
            }

            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: "Add product to cart fail!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async delete(req, res, next) {

    },
}

module.exports = CartController;