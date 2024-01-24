const { Response } = require("../../commons");
const { CartModel, ProductModel } = require("../../models");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");

const CartController = {
    async index(req, res, next) {
        const _user = req.locals._user;
        const carts =  await CartModel.find({ createdBy: _user?._id }).lean();
        carts.forEach((element) => {
            console.log(element);
        });
        res.render('client/cart', Response({ res, data: { carts } }));
    },
    async add(req, res, next) {
        try {
            const _user = req.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId });
            if(cartExist._id) {
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
    async update(req, res, next) {

    },
    async delete(req, res, next) {

    },
}

module.exports = CartController;