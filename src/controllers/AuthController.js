const jwt = require('jsonwebtoken');
const { Response } = require("../commons");
const { RESPONSE_CODE, USER_ROLE } = require("../constants");
const { authService } = require("../services");
const passport = require('passport');
const categoryService = require('../services/categoryService');

const AuthController = {
    async login(req, res, next) {
        try {
            const categories = await categoryService.getNestedAll();
            return res.render("login", Response({ res, data: { categories } }))
        } catch (error) {
            console.error(error);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message
            });
        }
    },
    async doLogin(req, res, next) {
        try {
            const user = req.body;
            const data = await authService.doLogin(user);
            if (data.errorCode == RESPONSE_CODE.SUCCESS) {
                const auth = jwt.sign(data.user, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                res.cookie("auth", auth);
                if (data.user.role == USER_ROLE.ADMIN) {
                    return res.json({
                        errorCode: RESPONSE_CODE.SUCCESS,
                        data: "/admin",
                        message: "Login successfully!"
                    });
                } else {
                    return res.json({
                        errorCode: RESPONSE_CODE.SUCCESS,
                        data: "/",
                        message: "Login successfully!"
                    });
                }
            }
            return res.json(data);
        } catch (e) {
            console.error(e);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async register(req, res, next) {
        try {
            const categories = await categoryService.getNestedAll();
            return res.render("login", Response({ res, data: { categories } }))
        } catch (error) {
            console.error(error);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message
            });
        }
    },
    async doRegister(req, res, next) {
        try {
            const user = req.body;
            const data = await authService.doRegister(user);
            if (data.errorCode == RESPONSE_CODE.SUCCESS) {
                const auth = jwt.sign(data.user, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                res.cookie("auth", auth);
            }
            return res.json(data);
        } catch (e) {
            console.error(e);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async doLogout(req, res, next) {
        try {
            res.clearCookie("auth");
            res.redirect('/auth/login');
        } catch (error) {
            console.error(error);
            return res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: error.message
            });
        }
    },
    loginWithFb: passport.authenticate('facebook'),
    async doLoginWithFb(req, res, next) {
        await passport.authenticate('facebook', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
            const auth = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
            res.cookie("auth", auth);
            if (user.role == USER_ROLE.ADMIN) {
                return res.redirect("/admin");
            } else {
                return res.redirect("/");
            }
        })(req, res, next)
    },
    loginWithGg: passport.authenticate('google', {
        scope: [
            'profile',
            'email'
        ],
    }),
    async doLoginWithGg(req, res, next) {
        await passport.authenticate('google', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
            const auth = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
            res.cookie("auth", auth);
            if (user.role == USER_ROLE.ADMIN) {
                return res.redirect("/admin");
            } else {
                return res.redirect("/");
            }
        })(req, res, next)
    }
}

module.exports = AuthController;