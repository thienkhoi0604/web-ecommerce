const moment = require("moment");
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { RESPONSE_CODE } = require('../constants');
const author = (...userRoles) => {
    return (req, res, next) => {
        const token = req.cookies.auth || req.headers.auth;
        jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
            if (!decode || Object.keys(decode)?.length <= 0) {
                res.clearCookie("auth");
                return res.redirect("/auth/login");
            } else {
                const { _id, exp, iat } = decode;
                const expired = moment.unix(exp).isAfter(moment());
                if (!expired) {
                    return res.redirect("/auth/login");
                }
                const user = await UserModel.findById({ _id });
                req.locals = res.locals || {};
                req.locals._user = user.toObject();
                res.locals = res.locals || {};
                res.locals._user = user.toObject();
                const haspPemission = userRoles.some(role => role == user.role);
                if (haspPemission) {
                    res.cookie("auth", jwt.sign(res.locals._user, process.env.SECRET_KEY, { expiresIn: 60 * 60 }));
                    next();
                } else {
                    //may be call api to add auth to header
                    if (!!req.cookies.auth) {
                        return res.redirect("/auth/login");
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