const { Response } = require("../../commons");
const { RESPONSE_CODE } = require("../../constants");
const { OrderModel, CardModel, CartModel, ProductModel } = require("../../models");
const categoryService = require("../../services/categoryService");

const CheckoutController = {
    async index(req, res, next) {
        const _user = res.locals._user;
        const order = await OrderModel.findOne({
            createdBy: _user?._id,
            isDeleted: false,
            status: {
                $in: ['Info', 'Payment', "Review"]
            }
        })
            .populate('cardObj')
            .lean();
        const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, cartId: null }).populate('productObj').lean();
        const cards = await CardModel.find({ isDeleted: false }).limit(5).sort({ updatedAt: -1, createdAt: -1 }).lean();
        const total = carts.reduce((total, item) => total + (item?.number * item?.productObj?.discountPrice || 0), 0);
        res.render('client/checkout', Response({ res, data: { order, carts, total, cards } }));
    },
    async info(req, res, next) {
        try {
            const _user = res.locals._user;
            const body = req.body;
            const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, orderId: null })
                .populate('productObj')
                .lean();
            if (carts.length === 0) {
                return res.json({
                    errorCode: RESPONSE_CODE.ERROR,
                    message: "Cart is empty!"
                });
            }
            const existOrder = await OrderModel.findOne({
                createdBy: _user?._id,
                isDeleted: false,
                status: {
                    $in: ['Info', 'Payment', "Review"]
                }
            }).lean();
            if (existOrder) {
                return res.json({
                    data: existOrder,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Checkout successfully!"
                });
            }
            body.userId = _user._id;
            body.totalPrice = carts.reduce((total, item) => total + (item?.number * item?.productObj?.discountPrice || 0), 0);
            body.createdBy = _user._id;
            body.status = "Payment";
            const order = await OrderModel.create(body);
            res.json({
                data: order,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Checkout successfully!"
            });
        } catch (error) {
            console.log(error);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    },
    async card(req, res, next) {
        try {
            const { _id, cardId } = req.body;
            const response = await OrderModel.findOneAndUpdate({ _id }, { cardId, status: "Review" }, { new: false });
            console.log(response);
            res.json({
                data: {
                    cardId
                },
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Checkout successfully!"
            });
        } catch (error) {
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    },
    async review(req, res, next) {
        const _user = res.locals._user;
        const { _id } = req.body;
        const order = await OrderModel.findById(_id).populate('cardObj');
        const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, cartId: null }).populate('productObj').lean();
        const total = carts.reduce((total, item) => total + (item?.number * item?.productObj?.discountPrice || 0), 0);
        const url = `${process.env.PAYMENT_SERVICE_URL}/payment/pay`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYMENT_SERVICE_SECRET}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cardNumber: order?.cardObj?.cardNumber,
                cardHolder: order?.cardObj?.cardHolder,
                expirationDate: order?.cardObj?.expirationDate,
                ccv: order?.cardObj?.ccv,
                amount: total
            })
        }).then(res => res.json());
        if (response.errorCode !== RESPONSE_CODE.SUCCESS) {
            return res.json({
                errorCode: response.errorCode,
                message: response.message
            });
        }
        order.status = "Proccess";
        await Promise.all(carts.map(async (item) => {
            const product = await ProductModel.findById(item.productObj._id).lean();
            product.quantity = product.quantity - item.number;
            await ProductModel.updateOne({ _id: item.productObj._id }, { quantity: product.quantity });
            await CartModel.updateOne({ _id: item._id }, { orderId: order._id });
        }));
        order.cartIds = carts.map(item => item._id);
        order.paidAt = new Date();
        await order.save();
        res.json({
            errorCode: RESPONSE_CODE.SUCCESS,
            message: "Checkout successfully!"
        });
    },
    async currentOrder(req, res, next) {
        try {
            const _user = res.locals._user;
            const order = await OrderModel.findOne({
                createdBy: _user?._id, isDeleted: false, status: {
                    $in: ['Info', 'Payment', "Review"]
                }
            })
                .populate('cardObj')
                .populate({
                    path: 'cartObjs',
                    populate: {
                        path: 'productObj',
                        model: 'products',
                    }
                })
                .lean();
            const carts = order?.cartObjs || [];
            const total = carts.reduce((total, item) => total + (item?.number * item?.productObj?.discountPrice || 0), 0);
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                data: { order, carts, total }
            });
        } catch (error) {
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    },
    async cancel(req, res, next) {
        try {
            const { _id } = req.body;
            const response = await OrderModel.updateOne({ _id }, { status: "Cancel" });
            console.log(response);
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Cancel successfully!"
            });
        } catch (error) {
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    },
    async back(req, res, next) {
        try {
            const { _id } = req.body;
            const response = await OrderModel.updateOne({ _id }, { status: "Info" });
            console.log(response);
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Back successfully!"
            });
        } catch (error) {
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    }
}

module.exports = CheckoutController;