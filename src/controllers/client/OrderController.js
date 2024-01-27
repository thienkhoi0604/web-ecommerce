const { Response } = require("../../commons");
const { CartModel, ProductModel, OrderModel } = require("../../models");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");
const categoryService = require("../../services/categoryService");

const OrderController = {
    async index(req, res, next) {
        try {
            const _user = res.locals._user;
            const orders = await OrderModel.find({ userId: _user?._id, isDeleted: false }).lean();
            const data = [];

            for(let i = 0 ; i < orders.length ; i++) {
                const cartIds = orders[i].cartIds;
                const carts = await CartModel.find({ '_id': { $in: cartIds }}).lean();
                if (!carts) {
                    return res.json({
                        errorCode: RESPONSE_CODE.ERROR,
                        message: "Fetch orders failed!"
                    });
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
                        cartId: cart?._id
                    }
                })

                data.push(result);
            }

            res.render('client/order', Response({ res, orders: data }));
        } catch (e) {
            console.log(e);
            res.render('client/order');
        }
    },
    async getAll(req, res, next) {
        try {
            const _user = res.locals._user;
            const orders = await OrderModel.find({ userId: _user?._id, isDeleted: false }).lean();
            const data = [];

            for(let i = 0 ; i < orders.length ; i++) {
                const cartIds = orders[i].cartIds;
                const carts = await CartModel.find({ '_id': { $in: cartIds }}).lean();
                if (!carts) {
                    return res.json({
                        errorCode: RESPONSE_CODE.ERROR,
                        message: "Fetch orders failed!"
                    });
                }

                const productIds = carts.map((element) => element.productId)

                const products = await ProductModel.find({
                    '_id': { $in: productIds }
                })

                const result = products.map((product) => {
                    const cart = carts.find((cart) => cart.productId.toString() === product._id.toString())
                    return {
                        ...product.toObject(),
                        status: orders[i].status,
                        quantity: cart?.number,
                        total: cart?.number * product.discountPrice,
                        cartId: cart?._id
                    }
                })

                data.push(result);
            }

            res.json({
                orders: data,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "successfully!"
            });
        } catch (e) {
            console.log(e);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
}

module.exports = OrderController;