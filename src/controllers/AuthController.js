const jwt = require('jsonwebtoken');
const { Response } = require("../commons");
const { RESPONSE_CODE, USER_ROLE } = require("../constants");
const { authService } = require("../services");
const { RegisterValidate, LoginValidate } = require("../utils");

const AuthController = {
    login(req, res, next) {
        return res.render("login", Response({ res, data: { layout: false } }))
    },
    async doLogin(req, res, next) {
        try {
            const user = await LoginValidate.user.validateAsync(req.body);
            const data = await authService.doLogin(user);
            if (data.error.code == RESPONSE_CODE.SUCCESS) {
                const userObject = data.user.toObject();
                const auth = jwt.sign(userObject, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                res.cookie("auth", auth);
                if (userObject.type == USER_ROLE.ADMIN) {
                    return res.redirect("/admin");
                } else {
                    return res.redirect("/");
                }
            }
            return res.render("login", Response({ res, data: { layout: false, ...data } }))
        } catch (e) {
            console.error(e);
            return res.render("login", Response({ res, data: { layout: false, error: e.details } }))
        }
    },
    register(req, res, next) {
        return res.render("register", Response({ res, data: { layout: false } }))
    },
    async doRegister(req, res, next) {
        try {
            const user = await RegisterValidate.user.validateAsync(req.body);
            const data = await authService.doRegister(user);
            if (data.error.code == RESPONSE_CODE.SUCCESS) {
                const userObject = data.user.toObject();
                const auth = jwt.sign(userObject, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                res.cookie("auth", auth);
                if (userObject.type == USER_ROLE.ADMIN) {
                    return res.redirect("/admin");
                } else {
                    return res.redirect("/");
                }
            }
            return res.render("register", Response({ res, data: { layout: false, ...data } }))
        } catch (e) {
            console.error(e);
            return res.render("register", Response({ res, data: { layout: false, error: e.details } }))
        }
    }
}

module.exports = AuthController;