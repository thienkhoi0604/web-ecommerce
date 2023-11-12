const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { RESPONSE_CODE } = require('../constants');
const author = (...userRoles) => {
    return (req, res, next) => {
        const token = req.cookies.auth || req.headers.auth;
        jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
            if (!decode || Object.keys(decode)?.length <= 0) {
                return res.redirect("/login");
            } else {
                const { _id } = decode;
                const user = await UserModel.find({ _id });
                const haspPemission = userRoles.some(role => role == user.type);
                if (haspPemission) {
                    next();
                } else {
                    //may be call api to add auth to header
                    if (!!req.cookies.auth) {
                        return res.redirect("/login");
                    } else {
                        return res.json({
                            error: {
                                code: RESPONSE_CODE.NO_PERMISSION,
                                message: "Your accout must have permisstion to do this action."
                            }
                        });
                    }
                }
            }
        })
    }
}
module.exports = author;