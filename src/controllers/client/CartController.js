const { Response } = require("../../commons");
const { CartModel, ProductModel } = require("../../models");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");
const categoryService = require("../../services/categoryService");
const { logger } = require("../../configs");

const CartController = {
    async index(req, res, next) {
        try {
            const _user = res.locals._user;
            const categories = await categoryService.getNestedAll();
            const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, orderId: null }).lean();

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
                    cartId: cart?._id
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
            const { productId, quantity = 1 } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId, isDeleted: false, orderId: null });
            if (cartExist?._id) {
                cartExist.number += Number.parseInt(quantity);
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist?._id, cartExist, { new: false }).lean();
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Add product to exist cart successfully!",
                    })
                })
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
            params.number = Number.parseInt(quantity);
            const cart = await CartModel.create(params);
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Add product to new cart successfully!",
                })
            })
            res.json({
                data: cart.toObject(),
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add product to cart successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async getAllByUser(req, res, next) {
        try {
            const _user = req.locals._user;
            const carts = await CartModel.find({ createdBy: _user?._id, isDeleted: false, orderId: null }).lean();

            if (!carts) {
                logger.log({
                    level: 'error',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Fetch carts failed!",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.ERROR,
                    message: "Fetch carts failed!"
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

            res.json({
                data: { carts, products: result },
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Get products by users successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async updateQuantity(req, res, next) {
        try {
            const _user = req.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId, isDeleted: false, orderId: null });
            if (cartExist?._id) {
                cartExist.number = quantity;

                if (quantity <= 0) {
                    return res.json({
                        errorCode: RESPONSE_CODE.ERROR,
                        message: "Can not update quantity product to cart! (min = 0)"
                    });
                }
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist?._id, cartExist, { new: false }).lean();
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Update quantity product to cart successfully!",
                    })
                })
                return res.json({
                    data: updatedCart,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Update quantity product to cart successfully!"
                });
            }
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Update quantity product to cart fail!",
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: "Update quantity product to cart fail!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async updateQuantityAdd(req, res, next) {
        try {
            const _user = res.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId, isDeleted: false, orderId: null });
            if (cartExist?._id) {
                cartExist.number += 1;
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist?._id, cartExist, { new: false }).lean();
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Add product to cart successfully!",
                    })
                })
                return res.json({
                    data: updatedCart,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Add product to cart successfully!"
                });
            }
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Add product to cart fail!",
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: "Add product to cart fail!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async updateQuantityMinus(req, res, next) {
        try {
            const _user = req.locals._user;
            const { productId } = req.body;

            const cartExist = await CartModel.findOne({ createdBy: _user?._id, productId: productId, isDeleted: false, orderId: null });
            if (cartExist?._id) {
                cartExist.number -= 1;
                if (cartExist.number <= 0) {
                    logger.log({
                        level: 'error',
                        message: JSON.stringify({
                            path: req.path,
                            body: req.body,
                            message: "Can not minus product to cart! (min = 0)",
                        })
                    })
                    return res.json({
                        errorCode: RESPONSE_CODE.ERROR,
                        message: "Can not minus product to cart! (min = 0)"
                    });
                }
                const updatedCart = await CartModel.findByIdAndUpdate(cartExist?._id, cartExist, { new: false }).lean();
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Minus product to cart successfully!",
                    })
                })
                return res.json({
                    data: updatedCart,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Minus product to cart successfully!"
                });
            }
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Minus product to cart fail!",
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: "Minus product to cart fail!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async delete(req, res, next) {
        try {
            const _user = req.locals._user;
            let { ids } = req.body;
            if (typeof ids === 'string') {
                ids = [ids];
            }
            const resonse = await CartModel.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedBy: _user?._id }).lean();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Delete carts successfully!",
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete carts successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
}

module.exports = CartController;