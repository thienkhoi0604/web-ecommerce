const moment = require("moment");
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { RESPONSE_CODE } = require('../constants');
const author = (...userRoles) => {
    return (req, res, next) => {
        const token = req.cookies.auth || req.headers.auth;
        const restful = req.headers["content-type"]?.toLocaleLowerCase() == "application/json";
        jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
            if (!decode || Object.keys(decode)?.length <= 0) {
                if (restful) {
                    return res.json({
                        errorCode: RESPONSE_CODE.REDIRECT,
                        data: "/auth/login",
                        message: "Token is invalid."
                    });
                }
                res.clearCookie("auth");
                return res.redirect("/auth/login");
            } else {
                const { _id, exp, iat } = decode;
                const expired = moment.unix(exp).isAfter(moment());
                if (!expired) {
                    if (restful) {
                        return res.json({
                            erroCode: RESPONSE_CODE.REDIRECT,
                            data: "/auth/login",
                            message: "Token is expired."
                        });
                    }
                    return res.redirect("/auth/login");
                }
                const user = await UserModel.findById({ _id });
                res.locals = res.locals || {};
                res.locals._user = user.toObject();
                const haspPemission = userRoles.some(role => role == user.role);
                if (haspPemission) {
                    res.cookie("auth", jwt.sign(res.locals._user, process.env.SECRET_KEY, { expiresIn: 60 * 60 }));
                    next();
                } else {
                    //may be call api to add auth to header
                    if (restful) {
                        return res.json({
                            errorCode: RESPONSE_CODE.REDIRECT,
                            data: "/auth/login",
                            message: "Your accout must have permisstion to do this action."
                        });
                    } else {
                        return res.redirect("/auth/login");
                    }
                }
            }
        })
    }
}
module.exports = author;