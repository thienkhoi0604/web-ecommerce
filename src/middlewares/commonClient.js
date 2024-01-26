const { CartModel } = require("../models");
const { categoryService } = require("../services");
const jwt = require('jsonwebtoken');
const commonClient = async (req, res, next) => {
    res.locals = res.locals || {};
    const categories = await categoryService.getNestedAll();
    res.locals.categories = categories;
    const token = req.cookies.auth || req.headers.auth;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
        if (!!error || !decode || Object.keys(decode)?.length <= 0) {
            //do nothing
        } else {
            const _user = decode;;
            const cartCount = await CartModel.countDocuments({ createdBy: _user?._id, isDeleted: false, orderId: null });
            res.locals.cartCount = cartCount;
        }
        next();
    })
}

module.exports = commonClient;