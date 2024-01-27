const { Response } = require("../../commons");
const { logger } = require("../../configs");
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
        const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, orderId: null }).populate('productObj').lean();
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
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Cart is empty!",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.ERROR,
                    message: "Cart is empty!"
                });
            }
            const errors = carts.filter(item => item?.productObj?.stock < item?.number).map(item => {
                return `${item?.productObj?.name} is out of stock! only ${item?.productObj?.stock} left!`;
            }) || []
            if (errors.length > 0) {
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Out of stock!",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.ERROR,
                    message: errors.join("\n")
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
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Checkout successfully!",
                        existOrder
                    })
                })
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
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Checkout successfully!",
                    order
                })
            })
            res.json({
                data: order,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Checkout successfully!"
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
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
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "After update order!",
                    response,
                })
            })
            res.json({
                data: {
                    cardId
                },
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Checkout successfully!"
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    },
    async review(req, res, next) {
        try {
            const _user = res.locals._user;
            const { _id } = req.body;
            const order = await OrderModel.findById(_id).populate('cardObj');
            const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, orderId: null }).populate('productObj').lean();
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
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Checkout error!",
                        response
                    })
                })
                return res.json({
                    errorCode: response.errorCode,
                    message: response.message
                });
            }
            const errors = carts.filter(item => item?.productObj?.stock < item?.number).map(item => {
                return `${item?.productObj?.name} is out of stock! only ${item?.productObj?.stock} left!`;
            }) || []
            if (errors.length > 0) {
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Out of stock!",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.ERROR,
                    message: errors.join("\n")
                });
            }
            order.status = "Proccess";
            await Promise.all(carts.map(async (item) => {
                const product = await ProductModel.findById(item.productObj._id).lean();
                product.quantity += - item.number;
                product.soldOut += item.number;
                await ProductModel.updateOne({ _id: item.productObj._id }, { stock: product.quantity, soldOut: product.soldOut });
                await CartModel.updateOne({ _id: item._id }, { orderId: order._id });
            }));
            order.cartIds = carts.map(item => item._id);
            order.paidAt = new Date();
            await order.save();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Checkout successfully!",
                    response
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Checkout successfully!"
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
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
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
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
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Cancel successfully!",
                    response
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Cancel successfully!"
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
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
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Back successfully!",
                    response
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Back successfully!"
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: error.message,
                    stack: error.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message,
            });
        }
    }
}

module.exports = CheckoutController;